import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import AdminUseCase from "App/Domain/UseCases/AdminUseCase";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import { UserRole } from "App/Data/Enums/User";

export default class AdminController  {
    private userRepository :UserRepository;
    private adminUseCase :AdminUseCase;
    constructor(){
        this.userRepository = new UserRepositoryImpl()
        this.adminUseCase = new AdminUseCase();
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

        if(authUser.role !== UserRole.ADMIN){
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "Only admin can access this resource",
                    },
                ],
            });
        }

        const { role } = request.body();

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

        await this.adminUseCase.updateRole(authUser.id, role);
       
        return response.send({
            result:true
        });
    }

   
}
