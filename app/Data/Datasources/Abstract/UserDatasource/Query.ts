import { UserRole } from "App/Data/Enums/User";
import { DateTime } from "luxon";

export class Query {
    public id: string | null = null;
    public ids: string[] | null = null;
    public notIds: string[] | null = null;

    public fullName: string | null = null;
    public fullNames: string[] | null = null;
    public notFullNames: string[] | null = null;

    public verified: boolean | null = null;

    public title: string | null = null;
    public titles: string[] | null = null;
    public notTitles: string[] | null = null;

    public role: UserRole | null = null;
    public roles: UserRole[] | null = null;
    public notRoles: UserRole[] | null = null;

    public username: string | null = null;
    public usernames: string[] | null = null;
    public notUsernames: string[] | null = null;

    public email: string | null = null;
    public emails: string[] | null = null;
    public notEmails: string[] | null = null;

    public minLastAccessedAt: DateTime | null = null;
    public maxLastAccessedAt: DateTime | null = null;

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

        if (options["fullName"] !== undefined) {
            this.fullName = options["fullName"];
        }
        if (options["fullNames"] !== undefined) {
            this.fullNames = options["fullNames"];
        }
        if (options["notFullNames"] !== undefined) {
            this.notFullNames = options["notFullNames"];
        }
        if (options["verified"] !== undefined) {
            this.verified = options["verified"];
        }
        if (options["title"] !== undefined) {
            this.title = options["title"];
        }
        if (options["titles"] !== undefined) {
            this.titles = options["titles"];
        }
        if (options["notTitles"] !== undefined) {
            this.notTitles = options["notTitles"];
        }
        if (options["role"] !== undefined) {
            this.role = options["role"];
        }
        if (options["roles"] !== undefined) {
            this.roles = options["roles"];
        }
        if (options["notRoles"] !== undefined) {
            this.notRoles = options["notRoles"];
        }
        if (options["username"] !== undefined) {
            this.username = options["username"];
        }
        if (options["usernames"] !== undefined) {
            this.usernames = options["usernames"];
        }
        if (options["notUsernames"] !== undefined) {
            this.notUsernames = options["notUsernames"];
        }
        if (options["email"] !== undefined) {
            this.email = options["email"];
        }
        if (options["emails"] !== undefined) {
            this.emails = options["emails"];
        }
        if (options["notEmails"] !== undefined) {
            this.notEmails = options["notEmails"];
        }
        if (options["minLastAccessedAt"] !== undefined) {
            this.minLastAccessedAt = options["minLastAccessedAt"];
        }
        if (options["maxLastAccessedAt"] !== undefined) {
            this.maxLastAccessedAt = options["maxLastAccessedAt"];
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
