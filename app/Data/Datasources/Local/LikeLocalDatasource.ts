import Like from "App/Data/Models/Like";
import { Query } from "App/Data/Datasources/Abstract/LikeDatasource/Query";
import UuidIssuer from "App/Service/UuidIssuer";
import LikeDatasource from "../Abstract/LikeDatasource";
import OrderExtractor from "./OrderExtractor";
import Order from "./OrderExtractor/Order";

export default class LikeLocalDatasourceImpl implements LikeDatasource {
    findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Like | null> {
        return Like.findBy("id", id);
    }

    findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<Like[]> {
        if (ids.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return Like.query().whereIn("id", ids);
    }

    findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Like[]> {
        return Like.query().where("user_id", userId);
    }

    findByPostId(
        postId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Like[]> {
        return Like.query().where("post_id", postId);
    }

    findByPostIds(
        postIds: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<Like[]> {
        if (postIds.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return Like.query().whereIn("post_id", postIds);
    }

    async existsById(id: string): Promise<boolean> {
        const like = await Like.findBy("id", id);
        return new Promise((resolve) => {
            resolve(like !== null);
        });
    }

    async save(
        like: Like,
        _?: { [key: string]: any } | undefined
    ): Promise<Like | null> {
        if (like.id === undefined) {
            like.id = UuidIssuer.issue();
        } else {
            if (like.$isNew) {
                const existed = await this.findById(like.id);
                if (existed !== null) {
                    existed.merge(like.toJsonForEntity());
                    like = existed;
                }
            }
        }
        return like.save();
    }

    totalCount(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    totalLikes(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    totalDislikes(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<Like[]> {
        return this.resolveEntities(query);
    }

    async deleteById(id: string): Promise<void> {
        await Like.query().where("id", id).delete();
    }

    private async resolveTotalCount(query: Query): Promise<number> {
        const queryBuilder = Like.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        const totalCount: bigint = await queryBuilder.getCount();

        return new Promise((resolve) => {
            resolve(Number(totalCount));
        });
    }

    private async resolveEntities(query: Query): Promise<Like[]> {
        const queryBuilder = Like.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        queryBuilder.offset(query.offset);
        queryBuilder.limit(query.limit);

        const order = this.extractOrder(query.sort);
        queryBuilder.orderBy(order.getColumn(), order.getDirection());

        const users: Like[] = await queryBuilder;

        return new Promise((resolve) => {
            resolve(users);
        });
    }

    private extractOrder(sort: string): Order {
        const extractor = new OrderExtractor("created_at", "desc");
        extractor.registerColumns(LikeDatasource.sortColumns);
        return extractor.createOrder(sort);
    }

    private async appendConditionsToQueryBuilder(queryBuilder, query: Query) {
        const id = query.id;
        const ids = query.ids;
        const notIds = query.notIds;

        const userId = query.userId;
        const postId = query.postId;
        const postIds = query.postIds;
        const notPostIds = query.notPostIds;
        const like = query.like;
        const dislike = query.dislike;

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
        if (postId !== null) {
            queryBuilder.where("post_id", postId);
        }
        if (postIds !== null) {
            if (postIds.length === 0) {
                queryBuilder.where("post_id", "NOT_EXIST");
            }
            if (postIds.length !== 0) {
                queryBuilder.whereIn("post_id", postIds);
            }
        }
        if (notPostIds !== null) {
            for (const notPostId of notPostIds) {
                queryBuilder.whereNot("post_id", notPostId);
            }
        }
        if (like !== null) {
            queryBuilder.where("like", like);
        }
        if (dislike !== null) {
            queryBuilder.where("dislike", dislike);
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
