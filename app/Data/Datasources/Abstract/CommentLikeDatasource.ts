import CommentLike from "App/Data/Models/CommentLike";
import { Query } from "App/Data/Datasources/Abstract/CommentLikeDatasource/Query";

export default abstract class CommentLikeDatasource {
    public static sortColumns = [
        "created_at",
        "updated_at",
    ]

    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<CommentLike | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<CommentLike[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<CommentLike[]>;
    abstract findByPostId(
        postId: string,
        options?: { [key: string]: any }
    ): Promise<CommentLike[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        like: CommentLike,
        options?: { [key: string]: any }
    ): Promise<CommentLike | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract totalLikes(query: Query): Promise<number>;
    abstract totalDislikes(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<CommentLike[]>;
    abstract deleteById(id: string): Promise<void>;
}