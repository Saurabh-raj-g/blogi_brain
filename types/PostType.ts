import { PostStatus } from "App/Data/Enums/Post";
import { ValueObjectType } from "./ValueObjectType";

export type PostType = {
    id: string;
    userId: string;
    readTime: number | null;
    readTimeType: ValueObjectType | null;
    title: string;
    status: PostStatus;
    body: JSON;
    createdAt: string;
    updatedAt: string;
};
