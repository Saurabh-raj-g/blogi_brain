import Post from "App/Data/Models/Post";
import { Query } from "App/Data/Datasources/Abstract/PostDatasource/Query";

export default abstract class PostDatasource {
    public static sortColumns = ["created_at", "updated_at"];

    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<Post | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<Post[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<Post[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        post: Post,
        options?: { [key: string]: any }
    ): Promise<Post | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<Post[]>;
    abstract deleteById(id: string): Promise<void>;
}
