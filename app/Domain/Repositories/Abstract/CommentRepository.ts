import CommentEntity from "App/Domain/Entities/CommentEntity";
import { Query } from "App/Domain/Repositories/Abstract/CommentRepository/Query";

export default abstract class CommentRepository {
    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<CommentEntity | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<CommentEntity[]>;
    abstract findByUserId(
        userId: string,
        options?: { [key: string]: any }
    ): Promise<CommentEntity[]>;
    abstract findByPostId(
        postId: string,
        options?: { [key: string]: any }
    ): Promise<CommentEntity[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract save(
        CommentEntity: CommentEntity,
        options?: { [key: string]: any }
    ): Promise<CommentEntity | null>;
    abstract update(
        CommentEntity: CommentEntity,
        options?: { [key: string]: any }
    ): Promise<CommentEntity | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<CommentEntity[]>;
    abstract deleteById(id: string): Promise<void>;
}