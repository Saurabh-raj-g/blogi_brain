import { DefaultViewFormatter as LikeFormatter } from "App/Controllers/ViewFormatters/Like/DefaultViewFormatter";
import LikeRepository from "App/Domain/Repositories/Abstract/LikeRepository";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import LikeRepositoryImpl from "App/Data/Repositories/LikeRepositoryImpl";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import { Query } from "App/Domain/Repositories/Abstract/LikeRepository/Query";
import { PostStatus } from "App/Data/Enums/Post";
import UtilString from "App/Utils/UtilString";

export default class ShowController {
    private likeRepository: LikeRepository;
    private postRepository: PostRepository;
    constructor() {
        this.likeRepository = new LikeRepositoryImpl();
        this.postRepository = new PostRepositoryImpl();
    }

    public async totalLikes({ request, response }) {
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

        const query = new Query();
        query.postId = postId;

        const post = await this.postRepository.findById(postId);
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

        if (post.status !== PostStatus.PUBLIC) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post is not public",
                    },
                ],
            });
        }

        const totalLikes = await this.likeRepository.totalLikes(query);
        return response.send({
            totalLikes,
        });
    }

    public async totalDislikes({ request, response }) {
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

        const query = new Query();
        query.postId = postId;

        const post = await this.postRepository.findById(postId);
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

        if (post.status !== PostStatus.PUBLIC) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post is not public",
                    },
                ],
            });
        }

        const totalDislikes = await this.likeRepository.totalDislikes(query);

        return response.send({
            totalDislikes,
        });
    }

    public async postLikedStatus({ auth, request, response }) {
        await auth.use("api").check();
        const isLoggedIn = auth.use("api").isLoggedIn;
        const authUser = await auth.use("api").user;

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

        if (!isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Unauthorized",
                    },
                ],
            });
        }

        const post = await this.postRepository.findById(postId);
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

        if (post.status !== PostStatus.PUBLIC) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "post is not public",
                    },
                ],
            });
        }

        const query = new Query();
        query.postId = postId;
        query.userId = authUser.id;

        const isLiked = await this.likeRepository.search(query);

        return response.send({
            isLiked,
        });
    }
}
