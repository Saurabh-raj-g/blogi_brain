import LikeEntity from "App/Domain/Entities/LikeEntity";
import { Query } from "App/Domain/Repositories/Abstract/LikeRepository/Query";

export default abstract class LikeRepository {
    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<LikeEntity | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<LikeEntity[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<LikeEntity[]>;
    abstract findByPostId(
        postId: string,
        options?: { [key: string]: any }
    ): Promise<LikeEntity[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract create(
        likeEntity: LikeEntity,
        options?: { [key: string]: any }
    ): Promise<LikeEntity | null>;
    abstract update(
        likeEntity: LikeEntity,
        options?: { [key: string]: any }
    ): Promise<LikeEntity | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract totalLikes(query: Query): Promise<number>;
    abstract totalDislikes(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<LikeEntity[]>;
    abstract deleteById(id: string): Promise<void>;
}