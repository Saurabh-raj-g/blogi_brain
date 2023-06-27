import CommentLikeEntity from "App/Domain/Entities/CommentLikeEntity";
import CommentLikeRepository from "App/Domain/Repositories/Abstract/CommentLikeRepository";
import { Query } from "App/Domain/Repositories/Abstract/CommentLikeRepository/Query";
import CommentLikeDatasource from "../Datasources/Abstract/CommentLikeDatasource";
import CommentLikeLocalDatasourceImpl from "../Datasources/Local/CommentLikeLocalDatasource";
import CommentLike from "../Models/CommentLike";

export default class CommentLikeRepositoryImpl
    implements CommentLikeRepository
{
    private commentLikeDatasource: CommentLikeDatasource;

    constructor() {
        this.commentLikeDatasource = new CommentLikeLocalDatasourceImpl();
    }

    async findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity | null> {
        const commentLike = await this.commentLikeDatasource.findById(id);
        if (commentLike === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const commentLikeEntity = CommentLikeEntity.fromJson(
            commentLike.toJsonForEntity()
        );
        return new Promise((resolve) => {
            resolve(commentLikeEntity);
        });
    }

    async findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity[]> {
        const commentLikes = await this.commentLikeDatasource.findByIds(ids);
        if (commentLikes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentLikeEntities = commentLikes.map((commentLike) => {
            return CommentLikeEntity.fromJson(commentLike.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(commentLikeEntities);
        });
    }

    async findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity[]> {
        const commentLikes = await this.commentLikeDatasource.findByUserId(
            userId
        );

        if (commentLikes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentLikeEntities = commentLikes.map((commentLike) => {
            return CommentLikeEntity.fromJson(commentLike.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentLikeEntities);
        });
    }

    async findByCommentId(
        commentId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity[]> {
        const commentLikes:any = await this.commentLikeDatasource.findById(
            commentId
        );

        if (commentLikes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentLikeEntities = commentLikes.map((commentLike) => {
            return CommentLikeEntity.fromJson(commentLike.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentLikeEntities);
        });
    }

    existsById(id: string): Promise<boolean> {
        return this.commentLikeDatasource.existsById(id);
    }

    async save(
        commentLikeEntity: CommentLikeEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity | null> {
        const commentLike = CommentLike.fromJson(
            commentLikeEntity.toJsonForModel()
        );
        const saved = await this.commentLikeDatasource.save(commentLike);
        if (saved === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const savedEntity = CommentLikeEntity.fromJson(saved.toJsonForEntity());

        return new Promise((resolve) => {
            resolve(savedEntity);
        });
    }

    public async update(
        commentLikeEntity: CommentLikeEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity> {
        const entity = await this.findById(commentLikeEntity.id);
        if (entity === null) {
            throw new Error(`Not found post ID:${commentLikeEntity.id}`);
        }

        const updatedEntity = await this.save(commentLikeEntity);

        return new Promise((resolve) => {
            resolve(updatedEntity!);
        });
    }

    totalCount(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.commentLikeDatasource.totalCount(datasourceQuery);
    }

    totalLikes(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.commentLikeDatasource.totalLikes(datasourceQuery);
    }

    totalDislikes(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.commentLikeDatasource.totalDislikes(datasourceQuery);
    }

    async search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentLikeEntity[]> {
        const datasourceQuery = query.toDatasourceQuery();
        const commentLikes = await this.commentLikeDatasource.search(
            datasourceQuery
        );
        if (commentLikes.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentLikeEntities = commentLikes.map((commentLike) => {
            return CommentLikeEntity.fromJson(commentLike.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentLikeEntities);
        });
    }

    deleteById(id: string): Promise<void> {
        return this.commentLikeDatasource.deleteById(id);
    }
}
