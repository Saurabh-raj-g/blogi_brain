import { PostStatus } from "App/Data/Enums/Post";
import { PostReadTimeType } from "App/ValueObjects/PostReadTimeType";

export type PostType = {
    id: string;
    userId:string;
    readTime: Number | null;
    readTimeType: PostReadTimeType | null;
    title: string;
    status:PostStatus;
    body: JSON;
    createdAt: string;
    updatedAt: string;
};