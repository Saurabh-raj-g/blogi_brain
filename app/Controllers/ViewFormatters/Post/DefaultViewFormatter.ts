import PostEntity from "App/Domain/Entities/PostEntity";
import { PostType } from "types/PostType";

export class DefaultViewFormatter {
    public toJson(postEntity: PostEntity): PostType {
        return {
            id: postEntity.id,
            userId: postEntity.userId,
            readTime: postEntity.readTime,
            readTimeType: postEntity.readTimeType === null ? null : postEntity.readTimeType?.toJson(),
            title: postEntity.title,
            status: postEntity.status,
            body: postEntity.body,
            createdAt: postEntity.createdAt.toISO()!,
            updatedAt: postEntity.updatedAt.toISO()!,
        };
    }
}
