import PostEntity from "../Entities/PostEntity";
import cloudinary from '@ioc:Adonis/Addons/Cloudinary'
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import { PostStatus } from "App/Data/Enums/Post";
import { PostReadTimeType } from "App/ValueObjects/PostReadTimeType";

export default class PostUseCase {
    private postRepository: PostRepository;

    constructor(){
        this.postRepository = new PostRepositoryImpl();
    }

    public async create(userId:string, readTimeType:PostReadTimeType | null,readTime:number | null, title:string,status:PostStatus,body:JSON,request:any): Promise<void> {
        /**
         * body: {
         *    obj : {
         *       innerObj : "njcshc"
         *       images : ["img1","img2"]
         *    },
         *    obj2 : {
         *       innerObj2 : "njcshc"
         *       images : ["img1","img2"]
         *    }
         * }
         */
        
        const postEntity = new PostEntity();

        const keys = Object.keys(body);
        let contents = {}

        let publicIds:string[] = [];
        for(let key in keys){
            let object = {};
            const innerKey = Object.keys(key);
            object[innerKey[0]] = body[key].innerKey[0]
            if(object[innerKey[1]]){
                object[innerKey[1]] =  []
                const images:MultipartFileContract[] = request.Files(
                    `${body[key].images}`,
                    {
                        size: "1mb",
                        extnames: [
                            "jpg",
                            "jpeg",
                            "png",
                            "gif",
                            "svg",
                            "webp",
                            "tif",
                            "heic",
                            "avif",
                        ]
                    }
                );

                try{

                    for (let image of images) {
                        if(!image){
                            throw new Error("File has not been submitted")
                        }
                
                        if (image.tmpPath === undefined) {
                            throw new Error("Failed to upload the file")
                        }
                
                        image.validate();
                        if (!image.isValid) {
                            throw new Error(image.errors[0] as any as string)
                        }
                        const myCloud = await cloudinary.upload(
                            image, 
                            image.clientName,
                            {
                                folder: "blogiBrain/posts",
                                crop: "scale",
                            }
                            
                        )
                        publicIds.push(myCloud.public_id);
    
                        object[innerKey[1]].push({
                            public_id : myCloud.public_id,
                            image_url : myCloud.secure_url
                        });
    
                    }

                }catch(e){
                    for(let publicId in publicIds){
                        await cloudinary.destroy(publicId)
                    }
                    throw new Error("Failed to store file")
                }
    
            }
            
            Object.assign(contents,object);

        }

        try{
            postEntity.userId = userId;
            postEntity.readTimeType = readTimeType;
            postEntity.readTime = readTime;
            postEntity.title = title;
            postEntity.status = status;
            postEntity.body = contents as any;

            await this.postRepository.save(postEntity);
        }catch(e){
            for(let publicId in publicIds){
                await cloudinary.destroy(publicId)
            }
           throw new  Error("Failed to create post")
        }

    }
    
}
