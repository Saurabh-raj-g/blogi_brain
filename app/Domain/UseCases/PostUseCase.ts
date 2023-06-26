import PostEntity from "../Entities/PostEntity";
import cloudinary from "@ioc:Adonis/Addons/Cloudinary";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import { PostStatus } from "App/Data/Enums/Post";
import { PostReadTimeType } from "App/ValueObjects/PostReadTimeType";

export default class PostUseCase {
    private postRepository: PostRepository;

    constructor() {
        this.postRepository = new PostRepositoryImpl();
    }

    public async create(
        userId: string,
        readTimeType: PostReadTimeType | null,
        readTime: number | null,
        title: string,
        status: PostStatus,
        body: Object[],
        request: any
    ): Promise<void> {
        /**
         * body: [
         *    {
         *       innerObj : "njcshc"
         *       images : ["img1","img2"]
         *    },
         *    {
         *       innerObj2 : "njcshc"
         *       images : ["img1","img2"]
         *    }
         * ]
         */
        const { contents, publicIds } = await this.formatPostInputBody(
            body,
            request
        );
        const postEntity = new PostEntity();

        try {
            postEntity.userId = userId;
            postEntity.readTimeType = readTimeType;
            postEntity.readTime = readTime;
            postEntity.title = title;
            postEntity.status = status;
            postEntity.body = JSON.stringify(contents) as any as JSON;

            await this.postRepository.save(postEntity);
        } catch (e) {
            for (let publicId in publicIds) {
                await cloudinary.destroy(publicId);
            }
            throw new Error("Failed to create post");
        }
    }

    private async formatPostInputBody(
        body: Object[],
        request: any
    ): Promise<{ contents: Object[]; publicIds: string[] }> {
        let contents: Object[] = [];
        let publicIds: string[] = [];

        for (let i = 0; i < body.length; i++) {
            const bodyObject = body[i];
            const newObject = {};
            const keys = Object.keys(bodyObject);
            for (let j = 0; j < keys.length; j++) {
                if (keys[j] === "images") {
                    newObject[keys[j]] = [];
                    const images: MultipartFileContract[] = request.Files(
                        `${bodyObject[keys[j]]}`,
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
                            ],
                        }
                    );

                    try {
                        for (let image of images) {
                            if (!image) {
                                throw new Error("File has not been submitted");
                            }

                            if (image.tmpPath === undefined) {
                                throw new Error("Failed to upload the file");
                            }

                            image.validate();
                            if (!image.isValid) {
                                throw new Error(
                                    image.errors[0] as any as string
                                );
                            }
                            const myCloud = await cloudinary.upload(
                                image,
                                image.clientName,
                                {
                                    folder: "blogi_brain/posts",
                                    crop: "scale",
                                }
                            );
                            publicIds.push(myCloud.public_id);

                            newObject[keys[j]].push({
                                public_id: myCloud.public_id,
                                image_url: myCloud.secure_url,
                            });
                        }
                    } catch (e) {
                        for (let publicId in publicIds) {
                            await cloudinary.destroy(publicId);
                        }
                        throw new Error("Failed to store file");
                    }
                } else {
                    newObject[keys[j]] = bodyObject[keys[j]];
                }
            }
            contents.push(newObject);
        }
        return { contents, publicIds };
    }
}
