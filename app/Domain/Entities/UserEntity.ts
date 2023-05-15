import { DateTime } from "luxon";
import { Language } from "App/ValueObjects/Language";
import { UserRole } from "App/Data/Enums/User";

export default class UserEntity implements BaseEntityInterface {
    public static fromJson(json: { [key: string]: any }): UserEntity {
        const language = Language.fromId<Language>(json.languageId);
        if (language.isUnknown()) {
            throw new Error(`LanguageId is invalid: ${json.languageId}`);
        }

        const entity = new this();
        entity.id = json.id;
        entity.fullName = json.fullName;
        entity.username = json.username;
        entity.email = json.email;
        entity.changeEmail = json.changeEmail;
        entity.verified = json.verified;
        entity.avatarId = json.avatarId;
        entity.avatarUrl = json.avatarUrl;
        entity.title = json.title;
        entity.role = json.role;
        entity.description = json.description;
        entity.language = language;
        entity.password = json.password;
        entity.rememberMeToken = json.rememberMeToken;
        entity.lastAccessedAt = json.lastAccessedAt;
        entity.resetPasswordToken = json.resetPasswordToken,
        entity.resetPasswordExpire = json.resetPasswordExpire,
        entity.emailVerificationToken = json.emailVerificationToken,
        entity.emailVerificationExpire = json.emailVerificationExpire,
        entity.createdAt = json.createdAt;
        entity.updatedAt = json.updatedAt;

        return entity;
    }

    public id: string;

    public fullName:string;

    public username: string;

    public email: string;

    public changeEmail: string | null;

    public verified: boolean;

    public avatarId: string | null;

    public avatarUrl: string | null;

    public title: string |null;

    public role: UserRole;

    public description: string | null;

    public language: Language;

    public password: string;

    public rememberMeToken: string | null;
    
    public resetPasswordToken: string | null;

    public resetPasswordExpire: DateTime | null;

    public emailVerificationToken: string | null;

    public emailVerificationExpire: DateTime | null;

    public lastAccessedAt: DateTime | null;

    public createdAt: DateTime;

    public updatedAt: DateTime;

    public toJsonForModel(): { [key: string]: any } {
        const json: { [key: string]: any } = {
            id: this.id,
            fullName: this.fullName,
            username: this.username,
            email: this.email,
            changeEmail: this.changeEmail,
            verified: this.verified,
            avatarId: this.avatarId,
            avatarUrl: this.avatarUrl,
            title: this.title,
            role: this.role,
            description: this.description,
            languageId: this.language.getId(),
            password: this.password,
            rememberMeToken: this.rememberMeToken,
            lastAccessedAt: this.lastAccessedAt,
            resetPasswordToken: this.resetPasswordToken,
            resetPasswordExpire: this.resetPasswordExpire,
            emailVerificationToken: this.emailVerificationToken,
            emailVerificationExpire: this.emailVerificationExpire,

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
