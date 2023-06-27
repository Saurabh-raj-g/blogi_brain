import { DefaultViewFormatter as UserFormatter } from "App/Controllers/ViewFormatters/User/DefaultViewFormatter";
import { UserRole } from "App/Data/Enums/User";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import { Query } from "App/Domain/Repositories/Abstract/UserRepository/Query";
import UtilString from "App/Utils/UtilString";

export default class ShowUserController {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepositoryImpl();
    }

    public async findById({ auth, request, response }) {
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

        if (authUser.role !== UserRole.ADMIN) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Only admin can access this resource",
                    },
                ],
            });
        }
        let { id } = request.qs();
        id = UtilString.getStringOrNull(id);

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

        const userEntity = await this.userRepository.findById(id);
        if (userEntity == null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the user, id:${id}`,
                    },
                ],
            });
        }

        const formatter = new UserFormatter();
        const userJson = formatter.toJson(userEntity);

        return response.send({
            user: userJson,
        });
    }

    public async findByUsername({ auth, request, response }) {
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

        if (authUser.role !== UserRole.ADMIN) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Only admin can access this resource",
                    },
                ],
            });
        }
        let { username } = request.qs();
        username = UtilString.getStringOrNull(username);

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

        const userEntity = await this.userRepository.findByUsername(username);
        if (userEntity == null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the user, username:${username}`,
                    },
                ],
            });
        }

        const formatter = new UserFormatter();
        const userJson = formatter.toJson(userEntity);

        return response.send({
            user: userJson,
        });
    }

    public async findByEmail({ auth, request, response }) {
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

        if (authUser.role !== UserRole.ADMIN) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Only admin can access this resource",
                    },
                ],
            });
        }
        let { email } = request.qs();
        email = UtilString.getStringOrNull(email);

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

        const userEntity = await this.userRepository.findByEmail(email);
        if (userEntity == null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the user, email:${email}`,
                    },
                ],
            });
        }

        const formatter = new UserFormatter();
        const userJson = formatter.toJson(userEntity);

        return response.send({
            user: userJson,
        });
    }

    public async search({ auth, request, response }) {
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

        if (authUser.role !== UserRole.ADMIN) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Only admin can access this resource",
                    },
                ],
            });
        }

        const params = request.qs();
        const keys = Object.keys(params);
        const query = new Query();

        for (let i = 0; i < keys.length; i++) {
            query[keys[i]] = params[keys[i]];
        }
        const userEntities = await this.userRepository.search(query);

        if (userEntities === null || userEntities.length === 0) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the users`,
                    },
                ],
            });
        }

        const formatter = new UserFormatter();
        const userJsons = userEntities.map((userEntity) => {
            return formatter.toJson(userEntity);
        });

        return response.send({
            users: userJsons,
        });
    }
}

/*
// const appendParamsToQuery = () => {
        //     const recurse = (obj: any) => {
        //         for (let [key, value] of Object.entries(obj ?? {})) {
        //             if(typeof value === "string"){
        //                 value = UtilString.getStringOrNull(value) as any

        //             }
        //             else if(typeof value === "object"){
        //                 recurse(obj[key]);
                        
        //             }
        //         }
        //     };

        //     recurse(params);
        // };

        // appendParamsToQuery();
*/
