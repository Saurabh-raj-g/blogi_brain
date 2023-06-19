import Like from "App/Data/Models/Like";
import { Query } from "App/Data/Datasources/Abstract/LikeDatasource/Query";

export default abstract class LikeDatasource {
    public static sortColumns = [
        "created_at",
        "updated_at",
    ]

    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<Like | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<Like[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<Like[]>;
    abstract findByPostId(
        postId: string,
        options?: { [key: string]: any }
    ): Promise<Like[]>;
   //todo findByIDPostIDAndUserId()
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        like: Like,
        options?: { [key: string]: any }
    ): Promise<Like | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract totalLikes(query: Query): Promise<number>;
    abstract totalDislikes(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<Like[]>;
    abstract deleteById(id: string): Promise<void>;
}

