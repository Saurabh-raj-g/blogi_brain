import Comment from "App/Data/Models/Comment";
import { Query } from "App/Data/Datasources/Abstract/CommentDatasource/Query";
import UuidIssuer from "App/Service/UuidIssuer";
import CommentDatasource from "../Abstract/CommentDatasource";
import OrderExtractor from "./OrderExtractor";
import Order from "./OrderExtractor/Order";

export default class CommentLocalDatasourceImpl implements CommentDatasource {
    findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Comment | null> {
        return Comment.findBy("id", id);
    }

    findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<Comment[]> {
        if (ids.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return Comment.query().whereIn("id", ids);
    }

    findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Comment[]> {
        return Comment.query().where("user_id", userId);
    }

    findByPostId(
        postId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<Comment[]> {
        return Comment.query().where("post_id", postId);
    }

    async existsById(id: string): Promise<boolean> {
        const comment = await Comment.findBy("id", id);
        return new Promise((resolve) => {
            resolve(comment !== null);
        });
    }

    async save(
        comment: Comment,
        _?: { [key: string]: any } | undefined
    ): Promise<Comment | null> {
        if (comment.id === undefined) {
            comment.id = UuidIssuer.issue();
        } else {
            if (comment.$isNew) {
                const existed = await this.findById(comment.id);
                if (existed !== null) {
                    existed.merge(comment.toJsonForEntity());
                    comment = existed;
                }
            }
        }
        return comment.save();
    }

    totalCount(query: Query): Promise<number> {
        return this.resolveTotalCount(query);
    }

    search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<Comment[]> {
        return this.resolveEntities(query);
    }

    async deleteById(id: string): Promise<void> {
        await Comment.query().where("id", id).delete();
    }

    private async resolveTotalCount(query: Query): Promise<number> {
        const queryBuilder = Comment.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        const totalCount: bigint = await queryBuilder.getCount();

        return new Promise((resolve) => {
            resolve(Number(totalCount));
        });
    }

    private async resolveEntities(query: Query): Promise<Comment[]> {
        const queryBuilder = Comment.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        queryBuilder.offset(query.offset);
        queryBuilder.limit(query.limit);

        const order = this.extractOrder(query.sort);
        queryBuilder.orderBy(order.getColumn(), order.getDirection());

        const users: Comment[] = await queryBuilder;

        return new Promise((resolve) => {
            resolve(users);
        });
    }

    private extractOrder(sort: string): Order {
        const extractor = new OrderExtractor("created_at", "desc");
        extractor.registerColumns(CommentDatasource.sortColumns);
        return extractor.createOrder(sort);
    }

    private async appendConditionsToQueryBuilder(queryBuilder, query: Query) {
        const id = query.id;
        const ids = query.ids;
        const notIds = query.notIds;

        const userId = query.userId;
        const postId = query.comment;
        const postIds = query.postIds;
        const notPostIds = query.notPostIds;
        const comment = query.comment;

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
        if (comment !== null) {
            queryBuilder.where("comment", `%${comment}%`);
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
