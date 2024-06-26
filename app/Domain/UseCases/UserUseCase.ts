import UserRepository from "../Repositories/Abstract/UserRepository";
import { Language } from "App/ValueObjects/Language";
import UserRepositoryImpl from "App/Data/Repositories/UserRepositoryImpl";
import UserEntity from "../Entities/UserEntity";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'
import Env from "@ioc:Adonis/Core/Env";
import TokenGenerator from "App/Service/TokenGenerator";
import NotificationEvent from "App/Service/NotificationService/NotificationEvent";
import NotificationService from "App/Service/NotificationService";
import crypto from "crypto";
import { DateTime } from "luxon";
import TokenVerificationService from "App/Service/TokenVerificationService";
export default class UserUseCase {
    private userRepository: UserRepository;

    constructor(){
        this.userRepository = new UserRepositoryImpl();
    }

    public async create(fullName:string, username:string,email:string,password:string,request:string): Promise<UserEntity> {
        let saved : UserEntity | null;
        try{
            const userEntity = new UserEntity();

            userEntity.fullName = fullName;
            userEntity.username = username;
            userEntity.email = email;
            userEntity.verified = false;
            userEntity.avatarId = null;
            userEntity.avatarUrl = null;
            userEntity.title = null;
            userEntity.description = null;
            userEntity.password = password;
            userEntity.rememberMeToken = null;
            userEntity.language = Language.english();
            userEntity.lastAccessedAt = null;
    
            saved = await this.userRepository.save(userEntity);
        }catch(e){
           throw new  Error("Failed to create user")
        }

        try{
            const token = await TokenGenerator.generate();
            saved!.emailVerificationToken = token;
            saved!.emailVerificationExpire = DateTime.prototype.plus(Env.get("EMAIL_VERIFICATION_TOKEN_EXPIRE")*60*1000);
            await this.userRepository.save(saved!);
        }catch(e){
            await this.userRepository.deleteById(saved!.id);
            throw new  Error("Failed to generate email verification token")
        }

        const options ={userId:saved!.id,request}
        try{
            await NotificationService.send(NotificationEvent.emailVerification(),options)
        }
        catch(e){
            saved!.emailVerificationToken = null;
            saved!.emailVerificationExpire =  null;
            await this.userRepository.deleteById(saved!.id);
            throw new Error(e)
        }

        return saved!;
       
    }
    
    public async verifyEmail(userId: string,token: string): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        const emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");

        const verified = await TokenVerificationService.verify(userEntity.emailVerificationToken!,emailVerificationToken,userEntity.emailVerificationExpire!)
        
        if(!verified){
            throw new Error(`email verification token is invalid or expired`);
        }

        try{
            userEntity.emailVerificationToken = null;
            userEntity.emailVerificationExpire =  null;
            userEntity.verified = true;
            await this.userRepository.save(userEntity);
         }catch(e){
           throw new  Error("Failed to verify email")
        }
        
    }

    public async updateLanguage(
        userId: string,
        language: Language
    ): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }
        try{
            userEntity.language = language;
            await this.userRepository.save(userEntity);
        }catch(e){
           throw new  Error("Failed to update language")
        }
        
    }

    public async changeEmailRequest(userId: string, email: string, request:any): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });

        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        try{
            const token = await TokenGenerator.generate();
            userEntity.changeEmail = email;
            userEntity.emailVerificationToken = token;
            userEntity.emailVerificationExpire =  DateTime.prototype.plus(Env.get("EMAIL_VERIFICATION_TOKEN_EXPIRE")*60*1000);
            await this.userRepository.save(userEntity);

         }catch(e){
           throw new  Error("Failed to generate email verification token")
        }

        const options ={userId,request}
        try{
            await NotificationService.send(NotificationEvent.emailVerification(),options)
        }
        catch(e){
            userEntity.emailVerificationToken = null;
            userEntity.emailVerificationExpire =  null;
            await this.userRepository.save(userEntity);
            throw new Error(e)
        }
        
    }

    public async updateEmail(userId: string,token: string): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        const emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");

        const verified = await TokenVerificationService.verify(userEntity.emailVerificationToken!,emailVerificationToken,userEntity.emailVerificationExpire!)
        
        if(!verified){
            throw new Error(`email verification token is invalid or expired`);
        }

        try{
            userEntity.emailVerificationToken = null;
            userEntity.emailVerificationExpire =  null;
            userEntity.email = userEntity.changeEmail!;
            const updated = await this.userRepository.save(userEntity);
            updated!.changeEmail = null;
            await this.userRepository.save(updated!);
         }catch(e){
           throw new  Error("Failed to update email")
        }
        
    }

    public async updateAvatar(userId:string, file:MultipartFileContract): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        try{
            if(userEntity.avatarId){
                await cloudinary.destroy(userEntity.avatarId);
            }

            const myCloud = await cloudinary.upload(
                file, 
                file.clientName,
                {
                    folder: "blogiBrain/avatars",
                    width: Env.get("THUMBNAIL_WIDTH"),
                    height: Env.get("THUMBNAIL_HEIGHT"),
                    crop: "scale",
                }
            );
            userEntity.avatarId = myCloud.public_id;
            userEntity.avatarUrl = myCloud.secure_url;
            await this.userRepository.save(userEntity);
         }catch(e){
           throw new  Error("Failed to update profile photo")
        }
        
    }

    public async sendResetPasswordToken(userId:string,request:any): Promise<void>{
        
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        try{
            const token = await TokenGenerator.generate();
            userEntity.resetPasswordToken = token;
            userEntity.resetPasswordExpire =  DateTime.prototype.plus(Env.get("RESET_PASSWORD_TOKEN_EXPIRE")*60*1000);
            await this.userRepository.save(userEntity);

         }catch(e){
           throw new  Error("Failed to generate reset password token")
        }

        const options ={userId,request}
        try{
            await NotificationService.send(NotificationEvent.resetPasssword(),options)
        }
        catch(e){
            userEntity.resetPasswordToken = null;
            userEntity.resetPasswordExpire =  null;
            await this.userRepository.save(userEntity);
            throw new Error(e)
        }
      

    }

    public async resetPassword(userId:string,token:string,password:string): Promise<void>{
        
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

        const verified = await TokenVerificationService.verify(userEntity.resetPasswordToken!,resetPasswordToken,userEntity.resetPasswordExpire!)
        
        if(!verified){
            throw new Error(`Reset Password Token is invalid or expired`);
        }

        try{
            userEntity.resetPasswordToken = null;
            userEntity.resetPasswordExpire =  null;
            userEntity.password = password;
            await this.userRepository.save(userEntity);

         }catch(e){
           throw new  Error("Failed to reset password")
        }

    }

    public async updatePassword(userId: string, password: string): Promise<void> {
        const userEntity = await this.userRepository.findById(userId, {
            append: false,
        });
        if (userEntity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        try{
            userEntity.password = password;
            await this.userRepository.save(userEntity);
         }catch(e){
           throw new  Error("Failed to update password")
        }
        
    }
}
