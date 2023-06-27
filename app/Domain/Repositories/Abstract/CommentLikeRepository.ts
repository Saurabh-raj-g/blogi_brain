import CommentLikeEntity from "App/Domain/Entities/CommentLikeEntity";
import { Query } from "App/Domain/Repositories/Abstract/CommentLikeRepository/Query";

export default abstract class CommentLikeRepository {
    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity[]>;
    abstract findByCommentId(
        commentId: string,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity[]>;
    //todo findByIDPostIDAndUserId()
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        commentLikeEntity: CommentLikeEntity,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity | null>;
    abstract update(
        commentLikeEntity: CommentLikeEntity,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract totalLikes(query: Query): Promise<number>;
    abstract totalDislikes(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<CommentLikeEntity[]>;
    abstract deleteById(id: string): Promise<void>;
}
