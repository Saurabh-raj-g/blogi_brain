import CommentLike from "App/Data/Models/CommentLike";
import { Query } from "App/Data/Datasources/Abstract/CommentLikeDatasource/Query";
import UuidIssuer from "App/Service/UuidIssuer";
import CommentLikeDatasource from "../Abstract/CommentLikeDatasource";
import OrderExtractor from "./OrderExtractor";
import Order from "./OrderExtractor/Order";

export default class CommentLikeLocalDatasourceImpl
    implements CommentLikeDatasource
{
    findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLike | null> {
        return CommentLike.findBy("id", id);
    }

    findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLike[]> {
        if (ids.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        return CommentLike.query().whereIn("id", ids);
    }

    findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLike[]> {
        return CommentLike.query().where("user_id", userId);
    }

    findByCommentId(commentId: string, _?: { [key: string]: any; } | undefined): Promise<CommentLike[]> {
        return CommentLike.query().where("comment_id", commentId);
    }

    async existsById(id: string): Promise<boolean> {
        const commentLike = await CommentLike.findBy("id", id);
        return new Promise((resolve) => {
            resolve(commentLike !== null);
        });
    }

    async save(
        commentLike: CommentLike,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLike | null> {
        if (commentLike.id === undefined) {
            commentLike.id = UuidIssuer.issue();
        } else {
            if (commentLike.$isNew) {
                const existed = await this.findById(commentLike.id);
                if (existed !== null) {
                    existed.merge(commentLike.toJsonForEntity());
                    commentLike = existed;
                }
            }
        }
        return commentLike.save();
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
    ): Promise<CommentLike[]> {
        return this.resolveEntities(query);
    }

    async deleteById(id: string): Promise<void> {
        await CommentLike.query().where("id", id).delete();
    }

    private async resolveTotalCount(query: Query): Promise<number> {
        const queryBuilder = CommentLike.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        const totalCount: bigint = await queryBuilder.getCount();

        return new Promise((resolve) => {
            resolve(Number(totalCount));
        });
    }

    private async resolveEntities(query: Query): Promise<CommentLike[]> {
        const queryBuilder = CommentLike.query();

        await this.appendConditionsToQueryBuilder(queryBuilder, query);

        queryBuilder.offset(query.offset);
        queryBuilder.limit(query.limit);

        const order = this.extractOrder(query.sort);
        queryBuilder.orderBy(order.getColumn(), order.getDirection());

        const users: CommentLike[] = await queryBuilder;

        return new Promise((resolve) => {
            resolve(users);
        });
    }

    private extractOrder(sort: string): Order {
        const extractor = new OrderExtractor("created_at", "desc");
        extractor.registerColumns(CommentLikeDatasource.sortColumns);
        return extractor.createOrder(sort);
    }

    private async appendConditionsToQueryBuilder(queryBuilder, query: Query) {
        const id = query.id;
        const ids = query.ids;
        const notIds = query.notIds;

        const userId = query.userId;
        const commentId = query.commentId;
        const commentIds = query.commentIds;
        const notCommentIds = query.notCommentIds;
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
        if (commentId !== null) {
            queryBuilder.where("comment_id", commentId);
        }
        if (commentIds !== null) {
            if (commentIds.length === 0) {
                queryBuilder.where("comment_id", "NOT_EXIST");
            }
            if (commentIds.length !== 0) {
                queryBuilder.whereIn("comment_id", commentIds);
            }
        }
        if (notCommentIds !== null) {
            for (const notPostId of notCommentIds) {
                queryBuilder.whereNot("comment_id", notPostId);
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
