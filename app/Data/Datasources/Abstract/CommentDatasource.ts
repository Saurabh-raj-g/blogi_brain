import Comment from "App/Data/Models/Comment";
import { Query } from "App/Data/Datasources/Abstract/CommentDatasource/Query";

export default abstract class CommentDatasource {
    public static sortColumns = ["created_at", "updated_at"];

    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<Comment | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<Comment[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<Comment[]>;
    abstract findByPostId(
        postId: string,
        options?: { [key: string]: any }
    ): Promise<Comment[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        comment: Comment,
        options?: { [key: string]: any }
    ): Promise<Comment | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<Comment[]>;
    abstract deleteById(id: string): Promise<void>;
}
