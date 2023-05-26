import { UserRole } from "App/Data/Enums/User";
import UserUseCase from "App/Domain/UseCases/UserUseCase";

export default class AdminUsersController  {
    private userUseCase :UserUseCase;
    constructor(){
        this.userUseCase = new UserUseCase();
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

        await this.userUseCase.updateRole(authUser.id, role);
       
        return response.send({
            result:true
        });
    }

   
}
