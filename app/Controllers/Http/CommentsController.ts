import { DefaultViewFormatter as CommentFormatter } from "App/Controllers/ViewFormatters/Comment/DefaultViewFormatter";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import CommentRepositoryImpl from "App/Data/Repositories/CommentRepositoryImpl";
import CommentRepository from "App/Domain/Repositories/Abstract/CommentRepository";
import UtilString from "App/Utils/UtilString";
import CommentEntity from "App/Domain/Entities/CommentEntity";

export default class CommentsController {
    private commentRepository: CommentRepository;
    private postRepository: PostRepository;
    constructor() {
        this.commentRepository = new CommentRepositoryImpl();
        this.postRepository = new PostRepositoryImpl();
    }
    public async create({ auth, request, response }) {
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

        let { postId, body } = request.body();
        postId = UtilString.getStringOrNull(postId);
        body = UtilString.getStringOrNull(body);

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

        if (body === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "body must be specified",
                    },
                ],
            });
        }

        const postEntity = await this.postRepository.findById(postId);

        if (postEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the post, id:${postId}`,
                    },
                ],
            });
        }

        let commentEntity: any = new CommentEntity();
        commentEntity.postId = postId;
        commentEntity.userId = authUser.id;
        commentEntity.comment = body;

        commentEntity = await this.commentRepository.save(commentEntity);

        const formatter = new CommentFormatter();
        const comment = formatter.toJson(commentEntity);
        return response.send({
            comment,
        });
    }

    public async save({ auth, request, response }) {
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

        let { commentId, body } = request.body();
        commentId = UtilString.getStringOrNull(commentId);
        body = UtilString.getStringOrNull(body);

        if (commentId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "commentId must be specified",
                    },
                ],
            });
        }

        if (body === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "body must be specified",
                    },
                ],
            });
        }

        let commentEntity: any = await this.commentRepository.findById(
            commentId
        );

        if (commentEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the comment, id:${commentId}`,
                    },
                ],
            });
        }

        if (commentEntity.userId !== authUser.id) {
            response.status(403);
            return response.send({
                errors: [
                    {
                        message: `Forbidden`,
                    },
                ],
            });
        }

        commentEntity.comment = body;

        commentEntity = await this.commentRepository.save(commentEntity);

        const formatter = new CommentFormatter();
        const comment = formatter.toJson(commentEntity);
        return response.send({
            comment,
        });
    }

    public async deleteById({ auth, request, response }) {
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

        let { commentId } = request.body();
        commentId = UtilString.getStringOrNull(commentId);

        if (commentId === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "commentId must be specified",
                    },
                ],
            });
        }

        let commentEntity: any = await this.commentRepository.findById(
            commentId
        );

        if (commentEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the comment, id:${commentId}`,
                    },
                ],
            });
        }

        if (commentEntity.userId !== authUser.id) {
            response.status(403);
            return response.send({
                errors: [
                    {
                        message: `Forbidden`,
                    },
                ],
            });
        }

        try {
            await this.commentRepository.deleteById(commentId);
            return response.send({
                result: true,
            });
        } catch (e) {
            response.status(500);
            return response.send({
                errors: [
                    {
                        message: `Failed to delete the comment, id:${commentId}`,
                    },
                ],
            });
        }
    }
}
