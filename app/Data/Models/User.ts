import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from "@ioc:Adonis/Core/Hash";
import { UserRole } from 'App/Data/Enums/User';
import Post from './Post';
import crypto from "crypto";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public fullName: string;

  @column()
  public username: string;

  @column()
  public email: string;

  @column()
  public changeEmail: string | null;

  @column({ serialize: Boolean })
  public verified:boolean;

  @column()
  public avatarId: string | null;

  @column()
  public avatarUrl: string | null;

  @column()
  public title: string;

  @column()
  public role: UserRole;

  @column()
  public description: string | null;

  @column()
  public languageId: number;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public resetPasswordToken: string | null;

  @column.dateTime()
  public resetPasswordExpire: DateTime | null;

  @column()
  public emailVerificationToken: string | null;

  @column.dateTime()
  public emailVerificationExpire: DateTime | null;

  @column.dateTime()
  public lastAccessedAt: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=>Post)
  public post: HasMany<typeof Post>

  @beforeSave()
  public static async hashPassword(user: User) {
      if (user.$dirty.password) {
          user.password = await Hash.make(user.password);
      }
  }

  @beforeSave()
  public static async hashToken(user: User) {
      if (user.resetPasswordToken !==null && user.$dirty.resetPasswordToken) {
          user.resetPasswordToken = crypto.createHash("sha256").update(user.resetPasswordToken).digest("hex");
      }
      if (user.emailVerificationToken !==null && user.$dirty.emailVerificationToken) {
          user.emailVerificationToken = crypto.createHash("sha256").update(user.emailVerificationToken).digest("hex");
      }
  }

  public static fromJson(json: { [key: string]: any }): User {
    const model = new User();
    model.merge(json);
    return model;
  }


  public toJsonForEntity(): { [key: string]: any } {
    return {
        id: this.id,
        fullName:this.fullName,
        username: this.username,
        email: this.email,
        changeEmail:this.changeEmail,
        verified:this.verified,
        avatarId:this.avatarId,
        avatarUrl:this.avatarUrl,
        title:this.title,
        role:this.role,
        description:this.description,
        languageId: this.languageId,
        password: this.password,
        rememberMeToken: this.rememberMeToken,
        lastAccessedAt: this.lastAccessedAt,
        resetPasswordToken: this.resetPasswordToken,
        resetPasswordExpire: this.resetPasswordExpire,
        emailVerificationToken: this.emailVerificationToken,
        emailVerificationExpire: this.emailVerificationExpire,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
    };
  }
}


 