import CommentEntity from "App/Domain/Entities/CommentEntity";
import CommentRepository from "App/Domain/Repositories/Abstract/CommentRepository";
import { Query } from "App/Domain/Repositories/Abstract/CommentRepository/Query";
import CommentDatasource from "../Datasources/Abstract/CommentDatasource";
import CommentLocalDatasourceImpl from "../Datasources/Local/CommentLocalDatasource";
import Comment from "../Models/Comment";

export default class CommentRepositoryImpl implements CommentRepository {
    private commentDatasource: CommentDatasource;

    constructor() {
        this.commentDatasource = new CommentLocalDatasourceImpl();
    }

    async findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity | null> {
        const comment = await this.commentDatasource.findById(id);
        if (comment === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const commentEntity = CommentEntity.fromJson(comment.toJsonForEntity());
        return new Promise((resolve) => {
            resolve(commentEntity);
        });
    }

    async findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity[]> {
        const comments = await this.commentDatasource.findByIds(ids);
        if (comments.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentEntities = comments.map((comment) => {
            return CommentEntity.fromJson(comment.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(commentEntities);
        });
    }

    async findByUserId(
        userId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity[]> {
        const comments = await this.commentDatasource.findByUserId(userId);

        if (comments.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentEntities = comments.map((comment) => {
            return CommentEntity.fromJson(comment.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentEntities);
        });
    }

    async findByPostId(
        postId: string,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity[]> {
        const comments = await this.commentDatasource.findByPostId(postId);

        if (comments.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentEntities = comments.map((comment) => {
            return CommentEntity.fromJson(comment.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentEntities);
        });
    }

    existsById(id: string): Promise<boolean> {
        return this.commentDatasource.existsById(id);
    }

    async save(
        commentEntity: CommentEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity | null> {
        const comment = Comment.fromJson(commentEntity.toJsonForModel());
        const saved = await this.commentDatasource.save(comment);
        if (saved === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const savedEntity = CommentEntity.fromJson(saved.toJsonForEntity());

        return new Promise((resolve) => {
            resolve(savedEntity);
        });
    }

    public async update(
        commentEntity: CommentEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity> {
        const entity = await this.findById(commentEntity.id);
        if (entity === null) {
            throw new Error(`Not found post ID:${commentEntity.id}`);
        }

        const updatedEntity = await this.save(commentEntity);

        return new Promise((resolve) => {
            resolve(updatedEntity!);
        });
    }

    totalCount(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.commentDatasource.totalCount(datasourceQuery);
    }

    async search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<CommentEntity[]> {
        const datasourceQuery = query.toDatasourceQuery();
        const comments = await this.commentDatasource.search(datasourceQuery);
        if (comments.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const commentEntities = comments.map((comment) => {
            return CommentEntity.fromJson(comment.toJsonForEntity());
        });

        return new Promise((resolve) => {
            resolve(commentEntities);
        });
    }

    deleteById(id: string): Promise<void> {
        return this.commentDatasource.deleteById(id);
    }
}
