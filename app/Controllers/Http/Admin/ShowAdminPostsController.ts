import { DefaultViewFormatter as PostFormatter } from "App/Controllers/ViewFormatters/Post/DefaultViewFormatter";
import { PostStatus } from "App/Data/Enums/Post";
import { UserRole } from "App/Data/Enums/User";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import { Query } from "App/Domain/Repositories/Abstract/PostRepository/Query";

export default class ShowController  {
    private postRepository :PostRepository;
    constructor(){
        this.postRepository = new PostRepositoryImpl()
      
    }
    public async findById({auth, params, response }) {
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

        const { id } = params;

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

        const postEntity = await this.postRepository.findById(id);

        if (postEntity === null) {
            response.status(404);
            return response.send({
                errors: [
                    {
                        message: `Not found the post, id:${id}`,
                    },
                ],
            });
        }

        const formatter = new PostFormatter();
        const postJson = formatter.toJson(postEntity);

        return response.send({
            post: postJson,
        });
    }

    public async search({auth, request, response }) {
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

       const params = request.qs()
       const keys = Object.keys(params)
        const query = new Query();

        for(let i=0;i<keys.length; i++){
            query[keys[i]] = params[keys[i]]
        }

       

        const postEntities = await this.postRepository.search(query);

        const formatter = new PostFormatter();
        
        const postJsons = postEntities.map(async(postEntity) => {
            return formatter.toJson(postEntity)
        });

        return response.send({
            posts: postJsons,
        });
    }
   
}