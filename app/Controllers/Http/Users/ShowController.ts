import { DefaultViewFormatter as UserFormatter } from "App/Controllers/ViewFormatters/User/DefaultViewFormatter";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";

export default class ShowController {
    private userRepository: UserRepository;
    constructor() {
        this.userRepository = new UserRepositoryImpl();
    }
    public async me({ auth, response }) {
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

        const userEntity = await this.userRepository.findById(authUser.id);
        if (userEntity == null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the user, id:${authUser.id}`,
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
}
