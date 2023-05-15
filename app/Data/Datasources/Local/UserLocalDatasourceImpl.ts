import User from "App/Data/Models/User";
import { Query } from "App/Data/Datasources/Abstract/UserDatasource/Query";
import UuidIssuer from "App/Service/UuidIssuer";
import UserDatasource from "../Abstract/UserDatasource";
import OrderExtractor from "./OrderExtractor";
import Order from "./OrderExtractor/Order";


export default class UserLocalDatasourceImpl implements UserDatasource {
    findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<User | null> {
        return User.findBy("id", id);
    }

    findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<User[]> {
        if (ids.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return User.query().whereIn("id", ids);
    }

    findByUsername(
        username: string,
        _?: { [key: string]: any } | undefined
    ): Promise<User | null> {
        return User.findBy("username", username);
    }

    findByUsernames(
        usernames: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<User[]> {
        if (usernames.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return User.query().whereIn("username", usernames);
    }

    findByEmail(
        email: string,
        _?: { [key: string]: any } | undefined
    ): Promise<User | null> {
        return User.findBy("email", email);
    }

    findByEmails(
        emails: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<User[]> {
        if (emails.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return User.query().whereIn("email", emails);
    }

    async existsById(id: string): Promise<boolean> {
        const user = await User.findBy("id", id);
        return new Promise((resolve) => {
            resolve(user !== null);
        });
    }

    async existsByUserName(username: string): Promise<boolean> {
        const user = await User.findBy("username", username);
        return new Promise((resolve) => {
            resolve(user !== null);
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        const user = await User.findBy("email", email);
        return new Promise((resolve) => {
            resolve(user !== null);
        });
    }

    async save(
        user: User,
        _?: { [key: string]: any } | undefined
    ): Promise<User | null> {
        if (user.id === undefined) {
            user.id = UuidIssuer.issue();
        } else {
            if (user.$isNew) {
                const existed = await this.findById(user.id);
                if (existed !== null) {
                    existed.merge(user.toJsonForEntity());
                    user = existed;
                }
            }
        }
        return user.save();
    }

    totalCount(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<User[]> {
        return this.resolveEntities(query);
    }

    async deleteById(id: string): Promise<void> {
        await User.query().where("id", id).delete();
    }

    private async resolveTotalCount(query: Query): Promise<number> {
        const queryBuilder = User.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        const totalCount: bigint = await queryBuilder.getCount();

        return new Promise((resolve) => {
            resolve(Number(totalCount));
        });
    }

    private async resolveEntities(query: Query): Promise<User[]> {
        const queryBuilder = User.query();
        
        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        queryBuilder.offset(query.offset);
        queryBuilder.limit(query.limit);

        const order = this.extractOrder(query.sort);
        queryBuilder.orderBy(order.getColumn(), order.getDirection());

        const users: User[] = await queryBuilder;

        return new Promise((resolve) => {
            resolve(users);
        });
    }

    private extractOrder(sort: string): Order {
        const extractor = new OrderExtractor("created_at", "desc");
        extractor.registerColumns(UserDatasource.sortColumns);
        return extractor.createOrder(sort);
    }

    private async appendConditionsToQueryBuilder(queryBuilder, query: Query) {
        const id = query.id;
        const ids = query.ids;
        const notIds = query.notIds;

        const fullName = query.fullName;
        const fullNames = query.fullNames;
        const notFullNames = query.notFullNames;

        const verified = query.verified;

        const title = query.title;
        const titles = query.titles;
        const notTitles = query.notTitles;

        const role = query.role;
        const roles = query.roles;
        const notRoles = query.notRoles;

        const username = query.username;
        const usernames = query.usernames;
        const notUsernames = query.notUsernames;

        const email = query.email;
        const emails = query.emails;
        const notEmails = query.notEmails;


        const minLastAccessedAt = query.minLastAccessedAt;
        const maxLastAccessedAt = query.maxLastAccessedAt;

        const minCreatedAt = query.minCreatedAt;
        const maxCreatedAt = query.maxCreatedAt;
        const minUpadtedAt = query.minUpdatedAt;
        const maxUpdatedAt = query.maxUpdatedAt;

        if (id !== null) {
            queryBuilder.where("id", id);
        }
        if (ids !== null) {
            if (ids.length === 0) {
                queryBuilder.where("id", "NOT_EXIST");
            }
            if (ids.length !== 0) {
                queryBuilder.whereIn("id", ids);
            }
        }
        if (notIds !== null) {
            for (const notId of notIds) {
                queryBuilder.whereNot("id", notId);
            }
        }


        if (fullName !== null) {
            queryBuilder.where("full_name","LIKE", `%${fullName}%`);
        }
        if (fullNames !== null) {
            if (fullNames.length === 0) {
                queryBuilder.where("full_name", "NOT_EXIST");
            }
            if (fullNames.length !== 0) {
                queryBuilder.whereIn("full_name", fullNames);
            }
        }
        if (notFullNames !== null) {
            for (const notFullName of notFullNames) {
                queryBuilder.whereNot("full_name", notFullName);
            }
        }
        if (verified !== null) {
            queryBuilder.where("verified", verified);
        }
        if (title !== null) {
            queryBuilder.where("title","LIKE", `%${title}%` );
        }
        if (titles !== null) {
            if (titles.length === 0) {
                queryBuilder.where("title", "NOT_EXIST");
            }
            if (titles.length !== 0) {
                queryBuilder.whereIn("title", titles);
            }
        }
        if (notTitles !== null) {
            for (const notTitle of notTitles) {
                queryBuilder.whereNot("title", notTitle);
            }
        }
        if (role !== null) {
            queryBuilder.where("role", role);
        }
        if (roles !== null) {
            if (roles.length === 0) {
                queryBuilder.where("role", "NOT_EXIST");
            }
            if (roles.length !== 0) {
                queryBuilder.whereIn("role", roles);
            }
        }
        if (notRoles !== null) {
            for (const notRole of notRoles) {
                queryBuilder.whereNot("role", notRole);
            }
        }
        if (username !== null) {
            queryBuilder.where("username", username);
        }
        if (usernames !== null) {
            if (usernames.length === 0) {
                queryBuilder.where("username", "NOT_EXIST");
            }
            if (usernames.length !== 0) {
                queryBuilder.whereIn("username", usernames);
            }
        }
        if (notUsernames !== null) {
            for (const notUsername of notUsernames) {
                queryBuilder.whereNot("username", notUsername);
            }
        }
        if (email !== null) {
            queryBuilder.where("email", email);
        }
        if (emails !== null) {
            if (emails.length === 0) {
                queryBuilder.where("email", "NOT_EXIST");
            }
            if (emails.length !== 0) {
                queryBuilder.whereIn("email", emails);
            }
        }
        if (notEmails !== null) {
            for (const notEmail of notEmails) {
                queryBuilder.whereNot("email", notEmail);
            }
        }
        if (minLastAccessedAt !== null) {
            queryBuilder.where(
                "last_accessed_at",
                ">=",
                minLastAccessedAt.toISO()
            );
        }
        if (maxLastAccessedAt !== null) {
            queryBuilder.where(
                "last_accessed_at",
                "<=",
                maxLastAccessedAt.toISO()
            );
        }

        if (minCreatedAt !== null) {
            queryBuilder.where("created_at", ">=", minCreatedAt.toISO());
        }
        if (maxCreatedAt !== null) {
            queryBuilder.where("created_at", "<=", maxCreatedAt.toISO());
        }
        if (minUpadtedAt !== null) {
            queryBuilder.where("created_at", ">=", minUpadtedAt.toISO());
        }
        if (maxUpdatedAt !== null) {
            queryBuilder.where("created_at", "<=", maxUpdatedAt.toISO());
        }
    }
}
