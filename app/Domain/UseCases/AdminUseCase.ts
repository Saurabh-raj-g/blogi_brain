import UserRepository from "../Repositories/Abstract/UserRepository";
import { Language } from "App/ValueObjects/Language";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import { UserRole } from "App/Data/Enums/User";

export default class AdminUseCase {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepositoryImpl();
    }
    public async updateRole(
        userId: string,
        role: UserRole
    ): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }
        try{
            userEntity.role = role;
            await this.userRepository.save(userEntity);
        }catch(e){
           throw new  Error("Failed to update role")
        }
        
    }

  
}
