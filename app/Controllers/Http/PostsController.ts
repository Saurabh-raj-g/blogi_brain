import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import { PostReadTimeType } from "App/ValueObjects/PostReadTimeType";
import { PostStatus } from "App/Data/Enums/Post";
import PostUseCase from "App/Domain/UseCases/PostUseCase";
import UtilString from "App/Utils/UtilString";

export default class PostsController {
    private postRepository: PostRepository;
    private postUseCase: PostUseCase;
    constructor() {
        this.postRepository = new PostRepositoryImpl();
        this.postUseCase = new PostUseCase();
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

        let { readTimeType, readTime, title, status, body } = request.body();
        readTimeType = UtilString.getStringOrNull(readTimeType);
        readTime = UtilString.getStringOrNull(readTime);
        title = UtilString.getStringOrNull(title);
        status = UtilString.getStringOrNull(status);

        if (title === undefined || title === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "title must be specified",
                    },
                ],
            });
        }

        if (status === undefined || status === null) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: "status must be specified",
                    },
                ],
            });
        }

        if (status === PostStatus.BANNED) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: `status is invalid, status:${status}`,
                    },
                ],
            });
        }

        if (readTime !== undefined || readTime !== null) {
            if (readTimeType === undefined || readTimeType === null) {
                response.status(400);
                return response.send({
                    errors: [
                        {
                            message: "readTimeType must be specified",
                        },
                    ],
                });
            }
        }

        const postReadTimeType =
            PostReadTimeType.fromName<PostReadTimeType>(readTimeType);
        if (postReadTimeType.isUnknown()) {
            response.status(400);
            return response.send({
                errors: [
                    {
                        message: `postReadTimeType is invalid, postReadTimeType:${readTimeType}`,
                    },
                ],
            });
        }

        await this.postUseCase.create(
            authUser.id,
            postReadTimeType,
            readTime,
            title,
            status,
            body,
            request
        );

        return response.send({
            result: true,
        });
    }
}
