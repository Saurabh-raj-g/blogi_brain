import CommentLikeRepository from "App/Domain/Repositories/Abstract/CommentLikeRepository";
import CommentLikeRepositoryImpl from "App/Data/Repositories/CommentLikeRepositoryImpl";
import CommentRepository from "App/Domain/Repositories/Abstract/CommentRepository";
import CommentRepositoryImpl from "App/Data/Repositories/CommentRepositoryImpl";
import UtilString from "App/Utils/UtilString";
import CommentLikeEntity from "App/Domain/Entities/CommentLikeEntity";
import { Query } from "App/Domain/Repositories/Abstract/CommentLikeRepository/Query";

export default class LikesController {
    private commentLikeRepository: CommentLikeRepository;
    private commentRepository: CommentRepository;

    constructor() {
        this.commentLikeRepository = new CommentLikeRepositoryImpl();
        this.commentRepository = new CommentRepositoryImpl();
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

        let comment = await this.commentRepository.findById(commentId);

        if (comment === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "comment not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.commentId = commentId;
        query.userId = authUser.id;

        let commentLikes: any = await this.commentLikeRepository.search(query);

        if (commentLikes.length === 0) {
            let commentLikeEntity: any = new CommentLikeEntity();
            commentLikeEntity.postId = commentId;
            commentLikeEntity.userId = authUser.id;
            commentLikeEntity.like = true;
            commentLikeEntity.dislike = false;
            try {
                commentLikeEntity = await this.commentLikeRepository.save(commentLikeEntity);
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
        if (commentLikes.length > 0 && commentLikes[0].like) {
            return response.send({
                return: true,
            });
        }
        if (commentLikes.length > 0) {
            commentLikes[0].like = true;
            commentLikes[0].dislike = false;
            try {
                commentLikes[0] = await this.commentLikeRepository.update(commentLikes[0]);
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

        let comment = await this.commentRepository.findById(commentId);

        if (comment === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "comment not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.commentId = commentId;
        query.userId = authUser.id;

        let commentLikes: any = await this.commentLikeRepository.search(query);

        if (commentLikes.length === 0) {
            let commentLikeEntity: any = new CommentLikeEntity();
            commentLikeEntity.postId = commentId;
            commentLikeEntity.userId = authUser.id;
            commentLikeEntity.like = false;
            commentLikeEntity.dislike = true;
            try {
                commentLikeEntity = await this.commentLikeRepository.save(commentLikeEntity);
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
        if (commentLikes.length > 0 && commentLikes[0].dislike) {
            return response.send({
                return: true,
            });
        }
        if (commentLikes.length > 0) {
            commentLikes[0].like = false;
            commentLikes[0].dislike = true;
            try {
                commentLikes[0] = await this.commentLikeRepository.update(commentLikes[0]);
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

        let { commentId } = request.qs();
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

        let comment = await this.commentRepository.findById(commentId);

        if (comment === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "comment not found",
                    },
                ],
            });
        }

        let query = new Query();
        query.commentId = commentId;
        query.userId = authUser.id;

        let commentLikes = await this.commentLikeRepository.search(query);

        if (commentLikes.length === 0) {
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
            await this.commentLikeRepository.deleteById(commentLikes[0].id);
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
