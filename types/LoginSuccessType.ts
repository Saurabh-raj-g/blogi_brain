import { UserType } from "./UserType";

export type LoginSuccessType = {
    type: string;
    token: string;
    tokenHash: string;
    expiresAt: string;
    user: UserType;
};
