import UserEntity from "App/Domain/Entities/UserEntity";
import { Query } from "App/Domain/Repositories/Abstract/UserRepository/Query";

export default abstract class UserRepository {
    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<UserEntity | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<UserEntity[]>;
    abstract findByUsername(
        username: string,
        options?: { [key: string]: any }
    ): Promise<UserEntity | null>;
    abstract findByUsernames(
        usernames: string[],
        options?: { [key: string]: any }
    ): Promise<UserEntity[]>;
    abstract findByEmail(
        email: string,
        options?: { [key: string]: any }
    ): Promise<UserEntity | null>;
    abstract findByEmails(
        emails: string[],
        options?: { [key: string]: any }
    ): Promise<UserEntity[]>;
    abstract findByUsernameOrEmail(
        usernameOrEmail: string,
        options?: { [key: string]: any }
    ): Promise<UserEntity | null>;
    abstract existsById(id: string): Promise<boolean>;
    abstract existsByUserName(username: string): Promise<boolean>;
    abstract existsByEmail(email: string): Promise<boolean>;
    abstract save(
        userEntity: UserEntity,
        options?: { [key: string]: any }
    ): Promise<UserEntity | null>;
    abstract update(
        userId: string,
        username: string,
        title: string | null,
        description: string | null
    ): Promise<UserEntity>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<UserEntity[]>;
    abstract deleteById(id: string): Promise<void>;
}
