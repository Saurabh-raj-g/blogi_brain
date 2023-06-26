import Post from "App/Data/Models/Post";
import { Query } from "App/Data/Datasources/Abstract/PostDatasource/Query";
import UuidIssuer from "App/Service/UuidIssuer";
import PostDatasource from "../Abstract/PostDatasource";
import OrderExtractor from "./OrderExtractor";
import Order from "./OrderExtractor/Order";

export default class PostLocalDatasourceImpl implements PostDatasource {
    findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Post | null> {
        return Post.findBy("id", id);
    }

    findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<Post[]> {
        if (ids.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return Post.query().whereIn("id", ids);
    }

    findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Post[]> {
        return Post.query().where("user_id", userId);
    }

    async existsById(id: string): Promise<boolean> {
        const post = await Post.findBy("id", id);
        return new Promise((resolve) => {
            resolve(post !== null);
        });
    }

    async save(
        post: Post,
        _?: { [key: string]: any } | undefined
    ): Promise<Post | null> {
        if (post.id === undefined) {
            post.id = UuidIssuer.issue();
        } else {
            if (post.$isNew) {
                const existed = await this.findById(post.id);
                if (existed !== null) {
                    existed.merge(post.toJsonForEntity());
                    post = existed;
                }
            }
        }
        return post.save();
    }

    totalCount(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<Post[]> {
        return this.resolveEntities(query);
    }

    async deleteById(id: string): Promise<void> {
        await Post.query().where("id", id).delete();
    }

    private async resolveTotalCount(query: Query): Promise<number> {
        const queryBuilder = Post.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        const totalCount: bigint = await queryBuilder.getCount();

        return new Promise((resolve) => {
            resolve(Number(totalCount));
        });
    }

    private async resolveEntities(query: Query): Promise<Post[]> {
        const queryBuilder = Post.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        queryBuilder.offset(query.offset);
        queryBuilder.limit(query.limit);

        const order = this.extractOrder(query.sort);
        queryBuilder.orderBy(order.getColumn(), order.getDirection());

        const users: Post[] = await queryBuilder;

        return new Promise((resolve) => {
            resolve(users);
        });
    }

    private extractOrder(sort: string): Order {
        const extractor = new OrderExtractor("created_at", "desc");
        extractor.registerColumns(PostDatasource.sortColumns);
        return extractor.createOrder(sort);
    }

    private async appendConditionsToQueryBuilder(queryBuilder, query: Query) {
        const id = query.id;
        const ids = query.ids;
        const notIds = query.notIds;

        const userId = query.userId;
        const title = query.title;
        const body = query.body;
        const status = query.status;

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
        if (userId !== null) {
            queryBuilder.where("user_id", userId);
        }
        if (title !== null) {
            queryBuilder.where("title", "LIKE", `%${title}%`);
        }

        if (body !== null) {
            queryBuilder.where("body", "LIKE", `%${body}%`);
        }

        if (status !== null) {
            queryBuilder.where("status", status);
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
