import UserEntity from "App/Domain/Entities/UserEntity";
import {PublicUserType} from "types/PublicUserType";

export class DefaultViewFormatter {
    public toJson(userEntity: UserEntity): PublicUserType {
        return {
            id: userEntity.id,
            fullName: userEntity.fullName,
            username: userEntity.username,
            avatarUrl: userEntity.avatarUrl,
            title: userEntity.title,
            description: userEntity.description,
            createdAt: userEntity.createdAt.toISO()!,
        };
    }
}
