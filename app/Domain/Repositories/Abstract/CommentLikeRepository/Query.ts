import { Query as DatasourceQuery } from "App/Data/Datasources/Abstract/CommentLikeDatasource/Query";
import { DateTime } from "luxon";

export class Query {
    public id: string | null = null;
    public ids: string[] | null = null;
    public notIds: string[] | null = null;

    public commentId: string | null = null;
    public commentIds: string[] | null = null;
    public notCommentIds: string[] | null = null;
    public userId: string | null = null;
    public like: boolean | null = null;
    public dislike: boolean | null = null;

    public minCreatedAt: DateTime | null = null;
    public maxCreatedAt: DateTime | null = null;
    public minUpdatedAt: DateTime | null = null;
    public maxUpdatedAt: DateTime | null = null;

    public offset = 0;
    public limit = 60;
    public sort = "created_at:desc";

    public static fromOptions(options?: { [key: string]: any }) {
        return new this(options);
    }

    constructor(options?: { [key: string]: any }) {
        if (options === undefined) {
            return;
        }
        if (options["id"] !== undefined) {
            this.id = options["id"];
        }
        if (options["ids"] !== undefined) {
            this.ids = options["ids"];
        }
        if (options["notIds"] !== undefined) {
            this.notIds = options["notIds"];
        }
        if (options["userId"] !== undefined) {
            this.userId = options["userId"];
        }
        if (options["commentId"] !== undefined) {
            this.commentId = options["commentId"];
        }
        if (options["commentIds"] !== undefined) {
            this.commentIds = options["commentIds"];
        }
        if (options["notCommentIds"] !== undefined) {
            this.notCommentIds = options["notCommentIds"];
        }
        if (options["like"] !== undefined) {
            this.like = options["like"];
        }
        if (options["dislike"] !== undefined) {
            this.dislike = options["dislike"];
        }
        if (options["minCreatedAt"] !== undefined) {
            this.minCreatedAt = options["minCreatedAt"];
        }
        if (options["maxCreatedAt"] !== undefined) {
            this.maxCreatedAt = options["maxCreatedAt"];
        }
        if (options["minUpdatedAt"] !== undefined) {
            this.minUpdatedAt = options["minUpadtedAt"];
        }
        if (options["maxUpdatedAt"] !== undefined) {
            this.maxUpdatedAt = options["maxUpadtedAt"];
        }
        if (options["offset"] != undefined) {
            this.offset = options["offset"];
        }
        if (options["limit"] != undefined) {
            this.limit = options["limit"];
        }
        if (options["sort"] != undefined) {
            this.sort = options["sort"];
        }
    }

    public toDatasourceQuery(): DatasourceQuery {
        const query = new DatasourceQuery();
        query.id = this.id;
        query.ids = this.ids;
        query.notIds = this.notIds;
        query.userId = this.userId;
        query.commentId = this.commentId;
        query.commentIds = this.commentIds;
        query.notCommentIds = this.notCommentIds;
        query.like = this.like;
        query.dislike = this.dislike;
        query.minCreatedAt = this.minCreatedAt;
        query.maxCreatedAt = this.maxCreatedAt;
        query.minUpdatedAt = this.minUpdatedAt;
        query.maxUpdatedAt = this.maxUpdatedAt;
        query.offset = this.offset;
        query.limit = this.limit;
        query.sort = this.sort;

        return query;
    }
}
