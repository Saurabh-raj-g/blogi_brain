import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Post from "./Post";

export default class Comment extends BaseModel {
    @column({ isPrimary: true })
    public id: string;

    @column()
    public postId: string;

    @column()
    public userId: string;

    @column()
    public comment: string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;

    @belongsTo(() => Post)
    public post: BelongsTo<typeof Post>;

    public static fromJson(json: { [key: string]: any }): Comment {
        const model = new Comment();
        model.merge(json);
        return model;
    }

    public toJsonForEntity(): { [key: string]: any } {
        return {
            id: this.id,
            postId: this.postId,
            userId: this.userId,
            comment: this.comment,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}