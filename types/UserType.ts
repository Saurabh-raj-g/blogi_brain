import { UserRole } from "App/Data/Enums/User";
import { ValueObjectType } from "./ValueObjectType";

export type UserType = {
    id: string;
    fullName:string;
    username: string;
    email: string;
    avatarUrl: string | null;
    title:string | null;
    role:UserRole;
    description: string | null;
    lastAccessedAt: string | null;
    language: ValueObjectType;
    createdAt: string;
    updatedAt: string;
};
