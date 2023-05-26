import UserEntity from "App/Domain/Entities/UserEntity";
import { Language } from "App/ValueObjects/Language";

export class TextMailViewFormatter {
    public toJson(userEntity: UserEntity,token:string, _: Language,request:any) {
        if(request === undefined || request ===null){
            throw new  Error("Failed to generate mail template")
        }

        return {
            id: userEntity.id,
            username: userEntity.username,
            email: userEntity.email,
            description: userEntity.description,
            resetPasswordUrl: `${request.headers().origin}/something/${token}`,
            resetPasswordExpire: userEntity.resetPasswordExpire,
            emailVerificationUrl: `${request.headers().origin}/something/${token}`,
            emailVerificationExpire: userEntity.emailVerificationExpire,
            language: userEntity.language.toJson(),
            lastAccessedAt: userEntity.lastAccessedAt,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
        };
    }
}
