import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import { PostStatus } from "../Enums/Post";
import User from "./User";
export default class Post extends BaseModel {
    @column({ isPrimary: true })
    public id: string;

    @column()
    public userId: string;

    @column()
    public readTime: Number | null;

    @column()
    public readTimeType: string | null;

    @column()
    public title: string;

    @column()
    public status: PostStatus;

    @column()
    public body: JSON;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>;

    public static fromJson(json: { [key: string]: any }): Post {
        const model = new Post();
        model.merge(json);
        return model;
    }

    public toJsonForEntity(): { [key: string]: any } {
        return {
            id: this.id,
            userId: this.userId,
            readTime: this.readTime,
            readTimeType: this.readTimeType,
            title: this.title,
            status: this.status,
            body: this.body,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
