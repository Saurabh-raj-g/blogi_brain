import LikeEntity from "App/Domain/Entities/LikeEntity";

export class DefaultViewFormatter {
    public toJson(likeEntity: LikeEntity): any {
        return {
            id: likeEntity.id,
            userId: likeEntity.userId,
            postId: likeEntity.postId,
            like: likeEntity.like,
            dislike: likeEntity.dislike,
            createdAt: likeEntity.createdAt.toISO()!,
            updatedAt: likeEntity.updatedAt.toISO()!,
        }
    }
}