import LikeRepository from "App/Domain/Repositories/Abstract/LikeRepository";
import LikeRepositoryImpl from "App/Data/Repositories/LikeRepositoryImpl";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import UtilString from "App/Utils/UtilString";
import LikeEntity from "App/Domain/Entities/LikeEntity";
import { Query } from "App/Domain/Repositories/Abstract/LikeRepository/Query";

export default class LikesController {
    private likeRepository: LikeRepository;
    private postRepository: PostRepository;

    constructor() {
        this.likeRepository = new LikeRepositoryImpl();
        this.postRepository = new PostRepositoryImpl();
    }

    public async createLike({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        if (!authUser.verified) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email not verified",
                    },
                ],
            });
        }

        let { postId } = request.body();
        postId = UtilString.getStringOrNull(postId);

        if (postId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "postId must be specified",
                    },
                ],
            });
        }

        let post = await this.postRepository.findById(postId);

        if (post === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.postId = postId;
        query.userId = authUser.id;

        let likes: any = await this.likeRepository.search(query);

        if (likes.length === 0) {
            let likeEntity: any = new LikeEntity();
            likeEntity.postId = postId;
            likeEntity.userId = authUser.id;
            likeEntity.like = true;
            likeEntity.dislike = false;
            try {
                likeEntity = await this.likeRepository.save(likeEntity);
                return response.send({
                    return: true,
                });
            } catch (error) {
                response.status(500);
                return response.send({
                    errors: [
                        {
                            message: "internal server error",
                        },
                    ],
                });
            }
        }
        if (likes.length > 0 && likes[0].like) {
            return response.send({
                return: true,
            });
        }
        if (likes.length > 0) {
            likes[0].like = true;
            likes[0].dislike = false;
            try {
                likes[0] = await this.likeRepository.update(likes[0]);
                return response.send({
                    return: true,
                });
            } catch (error) {
                console.log(error);
                response.status(500);
                return response.send({
                    errors: [
                        {
                            message: "internal server error",
                        },
                    ],
                });
            }
        }
    }

    public async createDislike({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        if (!authUser.verified) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email not verified",
                    },
                ],
            });
        }

        let { postId } = request.body();
        postId = UtilString.getStringOrNull(postId);

        if (postId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "postId must be specified",
                    },
                ],
            });
        }

        let post = await this.postRepository.findById(postId);

        if (post === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.postId = postId;
        query.userId = authUser.id;

        let likes: any = await this.likeRepository.search(query);

        if (likes.length === 0) {
            let likeEntity: any = new LikeEntity();
            likeEntity.postId = postId;
            likeEntity.userId = authUser.id;
            likeEntity.like = false;
            likeEntity.dislike = true;
            try {
                likeEntity = await this.likeRepository.save(likeEntity);
                return response.send({
                    return: true,
                });
            } catch (error) {
                response.status(500);
                return response.send({
                    errors: [
                        {
                            message: "internal server error",
                        },
                    ],
                });
            }
        }
        if (likes.length > 0 && likes[0].dislike) {
            return response.send({
                return: true,
            });
        }
        if (likes.length > 0) {
            likes[0].like = false;
            likes[0].dislike = true;
            try {
                likes[0] = await this.likeRepository.update(likes[0]);
                return response.send({
                    return: true,
                });
            } catch (error) {
                console.log(error);
                response.status(500);
                return response.send({
                    errors: [
                        {
                            message: "internal server error",
                        },
                    ],
                });
            }
        }
    }

    public async delete({ auth, request, response }) {
        await auth.use("api").check();
        if (!auth.use("api").isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Only authorized user can access",
                    },
                ],
            });
        }

        const authUser = auth.use("api").user;

        if (!authUser.verified) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "email not verified",
                    },
                ],
            });
        }

        let { postId } = request.qs();
        postId = UtilString.getStringOrNull(postId);

        if (postId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "postId must be specified",
                    },
                ],
            });
        }

        let post = await this.postRepository.findById(postId);

        if (post === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.postId = postId;
        query.userId = authUser.id;

        let likes = await this.likeRepository.search(query);

        if (likes.length === 0) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "entity not found",
                    },
                ],
            });
        }

        try {
            await this.likeRepository.deleteById(likes[0].id);
        } catch (error) {
            response.status(500);
            return response.send({
                errors: [
                    {
                        message: "internal server error",
                    },
                ],
            });
        }

        return response.send({
            like: null,
        });
    }
}
