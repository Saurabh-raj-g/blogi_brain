import CommentLikeEntity from "App/Domain/Entities/CommentLikeEntity";

export class DefaultViewFormatter {
    public toJson(commentLikeEntity: CommentLikeEntity): any {
        return {
            id: commentLikeEntity.id,
            userId: commentLikeEntity.userId,
            commentId: commentLikeEntity.commentId,
            like: commentLikeEntity.like,
            dislike: commentLikeEntity.dislike,
            createdAt: commentLikeEntity.createdAt.toISO()!,
            updatedAt: commentLikeEntity.updatedAt.toISO()!,
        };
    }
}
