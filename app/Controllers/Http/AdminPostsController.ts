import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import { PostStatus } from "App/Data/Enums/Post";
import { UserRole } from "App/Data/Enums/User";
import UtilString from "App/Utils/UtilString";

export default class AdminPostsController {
    private postRepository: PostRepository;
    constructor() {
        this.postRepository = new PostRepositoryImpl();
    }

    public async banPost({ auth, request, response }) {
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

        if (authUser.role !== UserRole.ADMIN) {
            response.status(406);
            return response.send({
                errors: [
                    {
                        message: "you are not supposed to access this route",
                    },
                ],
            });
        }

        let { status, id } = request.body();
        status = UtilString.getStringOrNull(status);
        id = UtilString.getStringOrNull(id);

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
        const postEntity = await this.postRepository.findById(id);

        if (postEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `post not found, id:${id}`,
                    },
                ],
            });
        }

        if (status === PostStatus.BANNED) {
            postEntity.status = PostStatus.BANNED;
            await this.postRepository.save(postEntity);
            return response.send({
                result: true,
            });
        }

        response.status(400);
        return response.send({
            errors: [
                {
                    message: `status is invalid, status:${status}`,
                },
            ],
        });
    }
}
