import { DateTime } from "luxon";
import { PostReadTimeType } from "App/ValueObjects/PostReadTimeType";
import { PostStatus } from "App/Data/Enums/Post";

export default class PostEntity implements BaseEntityInterface {
    public static fromJson(json: { [key: string]: any }): PostEntity {
        const readTimeType = PostReadTimeType.fromName<PostReadTimeType>(json.readTimeType);
        if (readTimeType.isUnknown()) {
            throw new Error(`readTimeType is invalid: ${json.readTimeType}`);
        }

        const entity = new this();
        entity.id = json.id;
        entity.userId = json.userId;
        entity.readTime = json.readTime;
        entity.readTimeType = readTimeType;
        entity.title = json.title;
        entity.status = json.status;
        entity.body = json.body;
        entity.createdAt = json.createdAt;
        entity.updatedAt = json.updatedAt;

        return entity;
    }

    public id: string;

    public userId:string;

    public readTime: Number | null;

    public readTimeType: PostReadTimeType | null;

    public title: string;

    public status: PostStatus;

    public body: JSON;

    public createdAt: DateTime;

    public updatedAt: DateTime;

    public toJsonForModel(): { [key: string]: any } {
        const json: { [key: string]: any } = {
            id: this.id,
            userId: this.userId,
            readTime: this.readTime,
            readTimeType: this.readTimeType !==null ? this.readTimeType.getName() : null,
            title: this.title,
            status: this.status,
            body: this.body,
        };
        if (this.createdAt !== undefined) {
            json["createdAt"] = this.createdAt;
        }
        if (this.updatedAt !== undefined) {
            json["updatedAt"] = this.updatedAt;
        }
        return json;
    }
}
