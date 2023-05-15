import User from "App/Data/Models/User";
import { Query } from "App/Data/Datasources/Abstract/UserDatasource/Query";

export default abstract class UserDatasource {
    public static sortColumns = [
        "last_accessed_at",
        "created_at",
        "updated_at",
    ];

    abstract findById(
        id: string,
        options?: { [key: string]: any }
    ): Promise<User | null>;
    abstract findByIds(
        ids: string[],
        options?: { [key: string]: any }
    ): Promise<User[]>;
    abstract findByUsername(
        username: string,
        options?: { [key: string]: any }
    ): Promise<User | null>;
    abstract findByUsernames(
        usernames: string[],
        options?: { [key: string]: any }
    ): Promise<User[]>;
    abstract findByEmail(
        email: string,
        options?: { [key: string]: any }
    ): Promise<User | null>;
    abstract findByEmails(
        email: string[],
        options?: { [key: string]: any }
    ): Promise<User[]>;
    abstract existsById(id: string): Promise<boolean>;
    abstract existsByUserName(username: string): Promise<boolean>;
    abstract existsByEmail(email: string): Promise<boolean>;
    abstract save(
        user: User,
        options?: { [key: string]: any }
    ): Promise<User | null>;
    abstract totalCount(query: Query): Promise<number>;
    abstract search(
        query: Query,
        options?: { [key: string]: any }
    ): Promise<User[]>;
    abstract deleteById(id: string): Promise<void>;
}
