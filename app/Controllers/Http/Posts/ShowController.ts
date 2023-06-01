import { DefaultViewFormatter as PostFormatter } from "App/Controllers/ViewFormatters/Post/DefaultViewFormatter";
import { PostStatus } from "App/Data/Enums/Post";
import PostRepositoryImpl from "App/Data/Repositories/PostRepositoryImpl";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import { Query } from "App/Domain/Repositories/Abstract/PostRepository/Query";
import UtilString from "App/Utils/UtilString";
import { PostType } from "types/PostType";

export default class ShowController  {
    private postRepository :PostRepository;
    constructor(){
        this.postRepository = new PostRepositoryImpl()
      
    }
    public async findById({auth, params, response }) {
        await auth.use("api").check();
       const isLoggedIn = auth.use("api").isLoggedIn ;
       const authUser = await auth.use("api").user;

        let { id } = params;
        id = UtilString.getStringOrNull(id)

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

        if(!isLoggedIn){
            if (postEntity.status !== PostStatus.PUBLIC) {
                response.status(404);
                return response.send({
                    errors: [
                        {
                            message: `Not found the post, id:${id}`,
                        },
                    ],
                });
            }
        }


        if(isLoggedIn){
            if (postEntity.status !== PostStatus.PUBLIC) {
                if(authUser.id !== postEntity.userId){
                    response.status(404);
                    return response.send({
                        errors: [
                            {
                                message: `Not found the post, id:${id}`,
                            },
                        ],
                    });
                }
            }
        }

        const formatter = new PostFormatter();
        const postJson = formatter.toJson(postEntity);

        return response.send({
            post: postJson,
        });
    }

    public async search({auth, request, response }) {
       await auth.use("api").check();
       const isLoggedIn = auth.use("api").isLoggedIn ;
       const authUser = await auth.use("api").user;

       const params = request.qs()
       const keys = Object.keys(params)
        const query = new Query();

        for(let i=0;i<keys.length; i++){
            query[keys[i]] = params[keys[i]]
        }

       

        const postEntities = await this.postRepository.search(query);

        const formatter = new PostFormatter();
        
        const postJsons: PostType[] = []

        postEntities.map((postEntity) => {
            if(!isLoggedIn){
                if (postEntity.status === PostStatus.PUBLIC) {
                    postJsons.push(formatter.toJson(postEntity))
                }
                return;
            }

            if(isLoggedIn){
                if (postEntity.status !== PostStatus.PUBLIC) {
                    if(authUser.id === postEntity.userId){
                        postJsons.push(formatter.toJson(postEntity))
                    }
                    return;
                }
                postJsons.push(formatter.toJson(postEntity))
            }

        });

        return response.send({
            posts: postJsons,
        });
    }
   
}
