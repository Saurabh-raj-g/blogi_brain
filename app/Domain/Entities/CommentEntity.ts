import { DateTime } from "luxon";

export default class CommentEntity implements BaseEntityInterface {
    public static fromJson(json: { [key: string]: any }): CommentEntity {
        const entity = new this();
        entity.id = json.id;
        entity.postId = json.postId;
        entity.userId = json.userId;
        entity.comment = json.comment;
        entity.createdAt = json.createdAt;
        entity.updatedAt = json.updatedAt;

        return entity;
    }

    public id: string;

    public postId:string;

    public userId:string;

    public comment: string;

    public createdAt: DateTime;

    public updatedAt: DateTime;

    public toJsonForModel(): { [key: string]: any } {
        const json: { [key: string]: any } = {
            id: this.id,
            postId: this.postId,
            userId: this.userId,
            comment: this.comment,
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
