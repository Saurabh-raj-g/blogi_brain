import UserEntity from "App/Domain/Entities/UserEntity";
import { UserType } from "types/UserType";

export class DefaultViewFormatter {

    public toJson(userEntity: UserEntity): UserType {
     
        return {
            id: userEntity.id,
            fullName:userEntity.fullName,
            username: userEntity.username,
            email: userEntity.email,
            avatarUrl: userEntity.avatarUrl,
            title:userEntity.title,
            role:userEntity.role,
            description: userEntity.description,
            lastAccessedAt:
                userEntity.lastAccessedAt !== null
                    ? userEntity.lastAccessedAt.toISO()
                    : null,
            language: userEntity.language.toJson(),
            createdAt: userEntity.createdAt.toISO()!,
            updatedAt: userEntity.updatedAt.toISO()!,
        };
    }
}
