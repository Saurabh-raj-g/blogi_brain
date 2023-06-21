import CommentEntity from "App/Domain/Entities/CommentEntity"

export class DefaultViewFormatter {
    public toJson(commentEntity: CommentEntity): any {
        return {
            id: commentEntity.id,
            userId: commentEntity.userId,
            postId: commentEntity.postId,
            comment: commentEntity.comment,
            createdAt: commentEntity.createdAt.toISO()!,
            updatedAt: commentEntity.updatedAt.toISO()!,
        }
    }
}