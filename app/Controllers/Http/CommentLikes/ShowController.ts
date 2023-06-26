import CommentLikeRepository from "App/Domain/Repositories/Abstract/CommentLikeRepository";
import CommentRepository from "App/Domain/Repositories/Abstract/CommentRepository";
import CommentLikeRepositoryImpl from "App/Data/Repositories/CommentLikeRepositoryImpl";
import CommentRepositoryImpl from "App/Data/Repositories/CommentRepositoryImpl";
import { Query } from "App/Domain/Repositories/Abstract/CommentLikeRepository/Query";
import UtilString from "App/Utils/UtilString";

export default class ShowController {
    private commentLikeRepository: CommentLikeRepository;
    private commentRepository: CommentRepository;
    constructor() {
        this.commentLikeRepository = new CommentLikeRepositoryImpl();
        this.commentRepository = new CommentRepositoryImpl();
    }

    public async totalLikes({ request, response }) {
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

        const query = new Query();
        query.commentId = commentId;

        const comment = await this.commentRepository.findById(commentId);
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

        const totalLikes = await this.commentLikeRepository.totalLikes(query);
        return response.send({
            totalLikes,
        });
    }

    public async totalDislikes({ request, response }) {
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

        const query = new Query();
        query.commentId = commentId;

        const comment = await this.commentRepository.findById(commentId);
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

        const totalDislikes = await this.commentLikeRepository.totalDislikes(query);

        return response.send({
            totalDislikes,
        });
    }

    public async postLikedStatus({ auth, request, response }) {
        await auth.use("api").check();
        const isLoggedIn = auth.use("api").isLoggedIn;
        const authUser = await auth.use("api").user;

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

        if (!isLoggedIn) {
            response.status(401);
            return response.send({
                errors: [
                    {
                        message: "Unauthorized user cannot access",
                    },
                ],
            });
        }

        const comment = await this.commentRepository.findById(commentId);
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

        const query = new Query();
        query.commentId = commentId;
        query.userId = authUser.id;

        const isLiked = await this.commentLikeRepository.search(query);

        return response.send({
            isLiked,
        });
    }
}
