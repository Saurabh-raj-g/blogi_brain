import { DefaultViewFormatter as UserFormatter } from "App/Controllers/ViewFormatters/User/DefaultViewFormatter";
import UtilString from "App/Utils/UtilString";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { Language } from "App/ValueObjects/Language";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import UserUseCase from "App/Domain/UseCases/UserUseCase";
import Env from "@ioc:Adonis/Core/Env";
import { LoginStatusType } from "types/LoginStatusType";
import { LoginSuccessType } from "types/LoginSuccessType";
import { ResultType } from "types/ResultType";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import User from "App/Data/Models/User";

export default class UsersController  {
    private userRepository :UserRepository;
    private userUseCase :UserUseCase;
    constructor(){
        this.userRepository = new UserRepositoryImpl()
        this.userUseCase = new UserUseCase();
    }
    
    public async loginStatus({ auth, response }) {
        await auth.use("api").check();

        const isLoggedIn = auth.use("api").isLoggedIn;
        let userJson: any | null = null;

        if (isLoggedIn) {
            const authUser = auth.use("api").user;
            const userEntity = await this.userRepository.findById(authUser.id);
            const formatter = new UserFormatter();
            userJson = formatter.toJson(userEntity!);
        }

        return response.send({
            isLoggedIn: isLoggedIn,
            user: userJson,
        } as LoginStatusType);
    }

    public async create({ auth, request, response }) {
        await auth.use("api").check();
        if (auth.use("api").isLoggedIn) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Authorized user can not access",
                    },
                ],
            });
        }

        const {fullName, username,email,password,confirmPassword } = request.body();

        if (fullName === undefined || fullName === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "fullName must be specified",
                    },
                ],
            });
        }

        if (username === undefined || username === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "username must be specified",
                    },
                ],
            });
        }

        if (email === undefined || email === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email must be specified",
                    },
                ],
            });
        }

        if (password === undefined || password === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "password must be specified",
                    },
                ],
            });
        }

        if (confirmPassword === undefined || confirmPassword === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "confirmPassword must be specified",
                    },
                ],
            });
        }

        if (confirmPassword !==password) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "password does not matched",
                    },
                ],
            });
        }

        

       const userEntity = await this.userUseCase.create(
        UtilString.getStringOrNull(fullName)!,
        UtilString.getStringOrNull(username)!,
        email,
        password,
        request
       )

       const token = await auth.use("api").generate(User.fromJson(userEntity.toJsonForModel()),
            {
                name: "login",
                expiresIn: Env.get("TOKEN_EXPIRES"),
            }
        )         
       
        const formatter = new UserFormatter();
        const userJson = formatter.toJson(userEntity!);

        return response.send({
            type: token.type,
            token: token.token,
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
            user: userJson,
        }as LoginSuccessType);
    }

    public async verifyEmail({ request, response }) {
        
        const { id,token } = request.qs();

        if (id === undefined || id === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "id must be specified",
                    },
                ],
            });
        }

        if (token ===undefined  ||token === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "token must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findById(id);

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${id}`,
                },
            ];
            return response.send({ errors });
        }


        await this.userUseCase.verifyEmail(id,token);

        return response.send({
            result: true,
        });
    }

    public async login({ auth, request, response }) {
        await auth.use("api").check();
        if (auth.use("api").isLoggedIn) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Authorized user is not supposed to access",
                    },
                ],
            });
        }

        const { username, email, password } = request.body();

        if ((username ===undefined || username === null )&& (email === undefined ||email === null)) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "username or email must be specified",
                    },
                ],
            });
        }

       
        if (password === undefined || password===null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "password must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findByUsernameOrEmail(
            email ? email :username
        );

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${ email ? email :username}`,
                },
            ];
            return response.send({ errors });
        }

        const token = await auth.use("api").attempt(email ? email :username,password,
                {
                    name: "login",
                    expiresIn: Env.get("TOKEN_EXPIRES"),
                }
        )
        const formatter = new UserFormatter();
        const userJson = formatter.toJson(userEntity);
        return response.send({
            type: token.type,
            token: token.token,
            tokenHash: token.tokenHash,
            expiresAt: token.expiresAt,
            user: userJson
        } as LoginSuccessType);
    }

    public async logout({ auth, response }) {
        await auth.use("api").check();
        const isLoggedIn = auth.use("api").isLoggedIn;
        if (!isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }
        await auth.use("api").revoke();
        return response.send({
            result: true,
        } as ResultType);
    }

    public async forgotPassword({ auth, request, response }) {
        await auth.use("api").check();
        if (auth.use("api").isLoggedIn) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Authorized user is not supposed to access",
                    },
                ],
            });
        }

        const { username, email } = request.body();

        if ((username ===undefined || username === null )&& (email === undefined ||email === null)) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "username or email must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findByUsernameOrEmail(
            email ? email :username
        );

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${ email ? email :username}`,
                },
            ];
            return response.send({ errors });
        }

        await this.userUseCase.sendResetPasswordToken(userEntity.id,request)
        
        return response.send({
            result:true
        });
    }
   // after calling forgotPassword 
   // call this to reset password
    public async resetPassword({ auth, request, response }) {
        await auth.use("api").check();
        if (auth.use("api").isLoggedIn) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Authorized user is not supposed to access",
                    },
                ],
            });
        }

        const {token, username} = request.qs();
        const {password, confirmPassword} = request.body();

        if (token ===undefined  ||token === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "token must be specified",
                    },
                ],
            });
        }

        if (username ===undefined  ||username === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "username must be specified",
                    },
                ],
            });
        }

        if (password ===undefined  ||password === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "password must be specified",
                    },
                ],
            });
        }

        if (confirmPassword ===undefined  ||confirmPassword === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "confirmPassword must be specified",
                    },
                ],
            });
        }

        if (confirmPassword !== password) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "password does not matched",
                    },
                ],
            });
        }


        const userEntity = await this.userRepository.findByUsername(username);

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${username}`,
                },
            ];
            return response.send({ errors });
        }

        await this.userUseCase.resetPassword(userEntity.id,token,password)
        
        return response.send({
            result:true
        });
    }

    public async updatePassword({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only Authorized user can access",
                    },
                ],
            });
        }

        const {password, confirmPassword} = request.body();

        if (password ===undefined  ||password === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "password must be specified",
                    },
                ],
            });
        }

        if (confirmPassword ===undefined  ||confirmPassword === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "confirmPassword must be specified",
                    },
                ],
            });
        }

        if (confirmPassword !== password) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "password does not matched",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        await this.userUseCase.updatePassword(authUser.id,password)
        
        return response.send({
            result:true
        });
    }

    public async isUsernameAvailable({ auth, request, response }) {
        const { username } = request.qs();

        if (username === undefined || username === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "username must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findByUsername(username, {
            append: false,
        });
        if (userEntity === null) {
            return response.send({
                result: true,
            });
        }

        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            return response.send({
                result: false,
            });
        }

        const authUser = auth.use("api").user;
        if (authUser.username === username) {
            return response.send({
                result: true,
            });
        }

        return response.send({
            result: false,
        } as ResultType);
    }

    public async isEmailAvailable({ auth, request, response }) {
        const { email } = request.qs();

        if (email === undefined || email === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findByEmail(email, {
            append: false,
        });
        if (userEntity === null) {
            return response.send({
                result: true,
            });
        }

        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            return response.send({
                result: false,
            });
        }

        const authUser = auth.use("api").user;
        if (authUser.email === email) {
            return response.send({
                result: true,
            });
        }

        return response.send({
            result: false,
        } as ResultType);
    }

    public async update({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        const {
            username,
            title,
            description,
        } = request.body();

        if (username === undefined || username === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "username must be specified",
                    },
                ],
            });
        }

        if (title === undefined || title === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "title must be specified",
                    },
                ],
            });
        }

        await this.userRepository.update(
            authUser.id,
            UtilString.getStringOrNull(username)!,
            UtilString.getStringOrNull(title),
            UtilString.getStringOrNull(description),
        );
    
        return response.send({
            result:true
        });
    }

    public async updateAvatar({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        const image: MultipartFileContract = request.file(
            "avatar",
            {
                size: "1mb",
                extnames: [
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "svg",
                    "webp",
                    "tif",
                    "heic",
                    "avif",
                ]
            }
        )

        if(!image){
            response.status(400);
            const errors = [{ message: "File has not been submitted" }];
            return response.send({ errors });
        }

        if (image.tmpPath === undefined) {
            response.status(400);
            const errors = [{ message: "Failed to upload the file" }];
            return response.send({ errors });
        }

        image.validate();
        if (!image.isValid) {
            response.status(400);
            return response.send({
                errors: [{ message: image.errors}] ,
            });
        }

        //const buffer = fs.readFileSync(image.tmpPath);
        

        await this.userUseCase.updateAvatar(authUser.id, image);

        return response.send({
            result: true,
        });
    }
    
    public async changeEmailRequest({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        const { email } = request.body();

        if (email === undefined || email === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email must be specified",
                    },
                ],
            });
        }

        await this.userUseCase.changeEmailRequest(authUser.id, email,request);

        return response.send({
            result: true,
        });
    }

    public async updateEmail({ request, response }) {
        
        const { id,token } = request.qs();

        if (id === undefined || id === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "id must be specified",
                    },
                ],
            });
        }

        if (token ===undefined  ||token === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message:
                            "token must be specified",
                    },
                ],
            });
        }

        const userEntity = await this.userRepository.findById(id);

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${id}`,
                },
            ];
            return response.send({ errors });
        }


        await this.userUseCase.updateEmail(id,token);

        return response.send({
            result: true,
        });
    }

    public async updateLanguage({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        const { language } = request.body();

        if (language === undefined || language === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "language must be specified",
                    },
                ],
            });
        }

        const objLanguage = Language.fromName<Language>(language);
        if (objLanguage.isUnknown()) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: `language is invalid, language:${language}`,
                    },
                ],
            });
        }
        
        await this.userUseCase.updateLanguage(authUser.id, objLanguage);
       
        return response.send({
            result:true
        });
    }
}
