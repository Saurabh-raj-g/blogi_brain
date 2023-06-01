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

        let {fullName, username,email,password,confirmPassword } = request.body();

        fullName = UtilString.getStringOrNull(fullName)
        username = UtilString.getStringOrNull(username)
        email = UtilString.getStringOrNull(email)
        password = UtilString.getStringOrNull(password)
        confirmPassword = UtilString.getStringOrNull(confirmPassword)

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

        let existed = await this.userRepository.findByUsername(username);

        if(existed !== null){
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: `username not available: ${username}`,
                    },
                ],
            });
        }

        existed = await this.userRepository.findByEmail(email);

        if(existed !== null){
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email not available",
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
        let { userId,token } = request.qs();
        userId = UtilString.getStringOrNull(userId)
        token = UtilString.getStringOrNull(token)

        if (userId === undefined || userId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "userId must be specified",
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

        const userEntity = await this.userRepository.findById(userId);

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${userId}`,
                },
            ];
            return response.send({ errors });
        }


        await this.userUseCase.verifyEmail(userId,token);

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

        let { usernameOrEmail, password } = request.body();
        usernameOrEmail = UtilString.getStringOrNull(usernameOrEmail)
        password = UtilString.getStringOrNull(password)

        if (usernameOrEmail ===undefined || usernameOrEmail === null ) {
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
            usernameOrEmail
        );

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${usernameOrEmail}`,
                },
            ];
            return response.send({ errors });
        }

        const token = await auth.use("api").attempt(usernameOrEmail,password,
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

        let { usernameOrEmail } = request.body();
        usernameOrEmail = UtilString.getStringOrNull(usernameOrEmail)
        if (usernameOrEmail ===undefined || usernameOrEmail === null ) {
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
            usernameOrEmail
        );

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${usernameOrEmail}`,
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

        let {token, username,password, confirmPassword} = request.body();
        token = UtilString.getStringOrNull(token)
        username = UtilString.getStringOrNull(username)
        password = UtilString.getStringOrNull(password)
        confirmPassword = UtilString.getStringOrNull(confirmPassword)

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

        let {password, confirmPassword} = request.body();
        password = UtilString.getStringOrNull(password)
        confirmPassword = UtilString.getStringOrNull(confirmPassword)

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
        let { username } = request.qs();
        username = UtilString.getStringOrNull(username)

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
        let { email } = request.qs();
        email = UtilString.getStringOrNull(email)

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

        let {
            username,
            title,
            description,
        } = request.body();
        username = UtilString.getStringOrNull(username)
        title = UtilString.getStringOrNull(title)
        description = UtilString.getStringOrNull(description)
        if (username === undefined || username === null || username === "") {
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
            username,
            title,
           description,
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

        let { email } = request.body();
        email = UtilString.getStringOrNull(email)

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

        let { language } = request.body();
        language = UtilString.getStringOrNull(language)

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
