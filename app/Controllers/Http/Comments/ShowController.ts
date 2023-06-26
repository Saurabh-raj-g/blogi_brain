import { DefaultViewFormatter as CommentFormatter } from "App/Controllers/ViewFormatters/Comment/DefaultViewFormatter";
import CommentRepositoryImpl from "App/Data/Repositories/CommentRepositoryImpl";
import CommentRepository from "App/Domain/Repositories/Abstract/CommentRepository";
import { Query } from "App/Domain/Repositories/Abstract/CommentRepository/Query";
import UtilString from "App/Utils/UtilString";

export default class ShowController {
    private commentRepository: CommentRepository;
    constructor() {
        this.commentRepository = new CommentRepositoryImpl();
    }
    public async findById({ params, response }) {
        let { id } = params;
        id = UtilString.getStringOrNull(id);

        if (id === undefined) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "id must be specified",
                    },
                ],
            });
        }

        const commentEntity = await this.commentRepository.findById(id);

        if (commentEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the comment, id:${id}`,
                    },
                ],
            });
        }

        const formatter = new CommentFormatter();
        const comment = formatter.toJson(commentEntity);
        return response.send({
            comment,
        });
    }
    public async findByIds({ request, response }) {
        let { ids } = request.qs();

        if (ids === null || ids === undefined) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "ids must be specified",
                    },
                ],
            });
        }

        const commentEntities = await this.commentRepository.findByIds(ids);

        const formatter = new CommentFormatter();
        const comments = commentEntities.map((commentEntity) => {
            formatter.toJson(commentEntity);
        });
        return response.send({
            comments,
        });
    }
    public async findByPostId({ params, response }) {
        let { postId } = params;
        postId = UtilString.getStringOrNull(postId);

        if (postId === undefined) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "postId must be specified",
                    },
                ],
            });
        }

        const commentEntities = await this.commentRepository.findByPostId(postId);

        const formatter = new CommentFormatter();
        const comments = commentEntities.map((commentEntity) => {
            formatter.toJson(commentEntity);
        });
        return response.send({
            comments,
        });
    }
    public async findByUserId({ request, response }) {
        let { userId } = request.qs();

        if (userId === null || userId === undefined) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "userId must be specified",
                    },
                ],
            });
        }

        const commentEntities = await this.commentRepository.findByUserId(userId);

        const formatter = new CommentFormatter();
        const comments = commentEntities.map((commentEntity) => {
            formatter.toJson(commentEntity);
        });
        return response.send({
            comments,
        });
    }
    public async existsById({ params, response }) {
        let { id } = params;
        id = UtilString.getStringOrNull(id);

        if (id === undefined) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "id must be specified",
                    },
                ],
            });
        }

        const exists = await this.commentRepository.existsById(id);
        return response.send({
            exists,
        });
    }
    public async search({ request, response }) {
        let { postId, userId, comment} = request.qs();
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
        query.userId = userId;
        query.comment = comment;

        const commentEntities = await this.commentRepository.search(query);

        const formatter = new CommentFormatter();
        const comments = commentEntities.map((commentEntity) => {
            formatter.toJson(commentEntity);
        });
        return response.send({
            comments,
        });
    }
    public async totalComments({ request, response }) {
        let { postId, userId} = request.qs();
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
        query.userId = userId;

        const total = await this.commentRepository.totalCount(query);
        return response.send({
            total,
        });
    }
}