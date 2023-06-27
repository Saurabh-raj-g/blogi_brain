import { DateTime } from "luxon";

export default class LikeEntity implements BaseEntityInterface {
    public static fromJson(json: { [key: string]: any }): LikeEntity {
        const entity = new this();
        entity.id = json.id;
        entity.postId = json.postId;
        entity.userId = json.userId;
        entity.like = json.like;
        entity.dislike = json.dislike;
        entity.createdAt = json.createdAt;
        entity.updatedAt = json.updatedAt;

        return entity;
    }

    public id: string;

    public postId: string;

    public userId: string;

    public like: boolean;

    public dislike: boolean;

    public createdAt: DateTime;

    public updatedAt: DateTime;

    public toJsonForModel(): { [key: string]: any } {
        const json: { [key: string]: any } = {
            id: this.id,
            postId: this.postId,
            userId: this.userId,
            like: this.like,
            dislike: this.dislike,
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
