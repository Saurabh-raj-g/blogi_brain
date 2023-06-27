import { UserRole } from "App/Data/Enums/User";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import UserUseCase from "App/Domain/UseCases/UserUseCase";
import UtilString from "App/Utils/UtilString";

export default class AdminUsersController {
    private userUseCase: UserUseCase;
    private userRepository: UserRepository;
    constructor() {
        this.userUseCase = new UserUseCase();
        this.userRepository = new UserRepositoryImpl();
    }

    public async updateRole({ auth, request, response }) {
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

        let { id, role } = request.body();
        role = UtilString.getStringOrNull(role);
        id = UtilString.getStringOrNull(id);

        if (role === undefined || role === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "role must be specified",
                    },
                ],
            });
        }

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

        if (userEntity === null) {
            response.status(404);
            const errors = [
                {
                    message: `Not found the user: ${id}`,
                },
            ];
            return response.send({ errors });
        }

        await this.userUseCase.updateRole(id, role);

        return response.send({
            result: true,
        });
    }
}
