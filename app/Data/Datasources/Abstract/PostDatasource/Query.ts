import { PostStatus } from "App/Data/Enums/Post";
import { DateTime } from "luxon";

export class Query {
    public id: string | null = null;
    public ids: string[] | null = null;
    public notIds: string[] | null = null;

    public userId: string | null = null;
    public title: string | null = null;
    public body: string | null = null;
    public status: PostStatus | null = null;

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
        if (options["title"] !== undefined) {
            this.title = options["title"];
        }
        if (options["body"] !== undefined) {
            this.body = options["body"];
        }
        if (options["status"] !== undefined) {
            this.status = options["status"];
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
}
