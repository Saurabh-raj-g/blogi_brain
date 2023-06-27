import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Comment from "./Comment";

export default class CommentLike extends BaseModel {
    @column({ isPrimary: true })
    public id: string;

    @column()
    public commentId: string;

    @column()
    public userId: string;

    @column()
    public like: boolean;

    @column()
    public dislike: boolean;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;

    @belongsTo(() => Comment)
    public comment: BelongsTo<typeof Comment>;

    public static fromJson(json: { [key: string]: any }): CommentLike {
        const model = new CommentLike();
        model.merge(json);
        return model;
    }

    public toJsonForEntity(): { [key: string]: any } {
        return {
            id: this.id,
            commentId: this.commentId,
            userId: this.userId,
            like: this.like,
            dislike: this.dislike,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
