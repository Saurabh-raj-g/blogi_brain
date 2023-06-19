import LikeEntity from "App/Domain/Entities/LikeEntity";
import LikeRepository from "App/Domain/Repositories/Abstract/LikeRepository";
import { Query } from "App/Domain/Repositories/Abstract/LikeRepository/Query";
import LikeDatasource from "../Datasources/Abstract/LikeDatasource";
import LikeLocalDatasourceImpl from "../Datasources/Local/LikeLocalDatasource";
import Like from "../Models/Like";

export default class LikeRepositoryImpl implements LikeRepository {
    private likeDatasource: LikeDatasource;

    constructor() {
        this.likeDatasource = new LikeLocalDatasourceImpl();
    }

    async findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity | null> {
        const like = await this.likeDatasource.findById(id);
        if (like === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const likeEntity = LikeEntity.fromJson(like.toJsonForEntity());  
        return new Promise((resolve) => {
            resolve(likeEntity);
        });
    }

    async findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity[]> {
        const likes = await this.likeDatasource.findByIds(ids);
        if (likes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const likeEntities = likes.map((like) => {
            return LikeEntity.fromJson(like.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(likeEntities);
        });
    }

    async findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity[] > {
        const likes = await this.likeDatasource.findByUserId(userId);
        
        if (likes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const likeEntities = likes.map((like) => {
            return LikeEntity.fromJson(like.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(likeEntities);
        });
    }

    async findByPostId(
        postId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity[] > {
        const likes = await this.likeDatasource.findByPostId(postId);
        
        if (likes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const likeEntities = likes.map((like) => {
            return LikeEntity.fromJson(like.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(likeEntities);
        });
    }
   
    existsById(id: string): Promise<boolean> {
        return this.likeDatasource.existsById(id);
    }

    async save(
        likeEntity: LikeEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity | null> {
        const like = Like.fromJson(likeEntity.toJsonForModel());
        const saved = await this.likeDatasource.save(like);
        if (saved === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const savedEntity = LikeEntity.fromJson(saved.toJsonForEntity());
        
        return new Promise((resolve) => {
            resolve(savedEntity);
        });
    }

    public async update(
        likeEntity: LikeEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity> {
        const entity = await this.findById(likeEntity.id);
        if (entity === null) {
            throw new Error(`Not found post ID:${likeEntity.id}`);
        }
      
        const updatedEntity = await this.save(entity);

        return new Promise((resolve) => {
            resolve(updatedEntity!);
        });
    }

    totalCount(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.likeDatasource.totalCount(datasourceQuery);
    }

    totalLikes(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.likeDatasource.totalLikes(datasourceQuery);
    }

    totalDislikes(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.likeDatasource.totalDislikes(datasourceQuery);
    }

    async search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<LikeEntity[]> {
        const datasourceQuery = query.toDatasourceQuery();
        const likes = await this.likeDatasource.search(datasourceQuery);
        if (likes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const likeEntities = likes.map((like) => {
            return LikeEntity.fromJson(like.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(likeEntities);
        });
    }

    deleteById(id: string): Promise<void> {
        return this.likeDatasource.deleteById(id);
    }

}
