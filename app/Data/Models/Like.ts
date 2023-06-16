import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Post from "./Post";

export default class Like extends BaseModel {
    @column({ isPrimary: true })
    public id: string;

    @column()
    public postId: string;

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

    @belongsTo(() => Post)
    public post: BelongsTo<typeof Post>;

    public static fromJson(json: { [key: string]: any }): Like {
        const model = new Like();
        model.merge(json);
        return model;
    }

    public toJsonForEntity(): { [key: string]: any } {
        return {
            id: this.id,
            postId: this.postId,
            userId: this.userId,
            like: this.like,
            dislike: this.dislike,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}