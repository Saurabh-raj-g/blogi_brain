import PostEntity from "App/Domain/Entities/PostEntity";
import { Query } from "App/Domain/Repositories/Abstract/PostRepository/Query";

export default abstract class UserRepository {
    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<PostEntity | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<PostEntity[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<PostEntity[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        postEntity: PostEntity,
        options?: { [key: string]: any }
    ): Promise<PostEntity | null>;
    abstract update(
        postId: string,
        title: string,
        body: JSON,
    ): Promise<PostEntity>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<PostEntity[]>;
    abstract deleteById(id: string): Promise<void>;
}