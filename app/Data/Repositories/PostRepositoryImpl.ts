import PostEntity from "App/Domain/Entities/PostEntity";
import PostRepository from "App/Domain/Repositories/Abstract/PostRepository";
import { Query } from "App/Domain/Repositories/Abstract/PostRepository/Query";
import PostDatasource from "App/Data/Datasources/Abstract/PostDatasource";
import PostDatasourceImpl  from "App/Data/Datasources/Local/PostLocalDatasourceImpl";
import Post from "../Models/Post";

export default class PostRepositoryImpl implements PostRepository {
    private postDatasource: PostDatasource;

    constructor() {
        this.postDatasource = new PostDatasourceImpl();
    }

    async findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<PostEntity | null> {
        const post = await this.postDatasource.findById(id);
        if (post === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const postEntity = PostEntity.fromJson(post.toJsonForEntity());  
        return new Promise((resolve) => {
            resolve(postEntity);
        });
    }

    async findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<PostEntity[]> {
        const posts = await this.postDatasource.findByIds(ids);
        if (posts.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const postEntities = posts.map((post) => {
            return PostEntity.fromJson(post.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(postEntities);
        });
    }

    async findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<PostEntity[] > {
        const posts = await this.postDatasource.findByUserId(userId);
        
        if (posts.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const postEntities = posts.map((post) => {
            return PostEntity.fromJson(post.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(postEntities);
        });
    }
   
    existsById(id: string): Promise<boolean> {
        return this.postDatasource.existsById(id);
    }

    async save(
        postEntity: PostEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<PostEntity | null> {
        const post = Post.fromJson(postEntity.toJsonForModel());
        const saved = await this.postDatasource.save(post);
        if (saved === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const savedEntity = PostEntity.fromJson(saved.toJsonForEntity());
        
        return new Promise((resolve) => {
            resolve(savedEntity);
        });
    }

    public async update(
        postId: string,
        title: string,
        body: JSON,
    ): Promise<PostEntity> {
        const entity = await this.findById(postId);
        if (entity === null) {
            throw new Error(`Not found post ID:${postId}`);
        }

        entity.title = title;
        entity.body = body;
      
        const updatedEntity = await this.save(entity);

        return new Promise((resolve) => {
            resolve(updatedEntity!);
        });
    }

    totalCount(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.postDatasource.totalCount(datasourceQuery);
    }

    async search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<PostEntity[]> {
        const datasourceQuery = query.toDatasourceQuery();
        const posts = await this.postDatasource.search(datasourceQuery);
        if (posts.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const postEntities = posts.map((post) => {
            return PostEntity.fromJson(post.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(postEntities);
        });
    }

    deleteById(id: string): Promise<void> {
        return this.postDatasource.deleteById(id);
    }

}
