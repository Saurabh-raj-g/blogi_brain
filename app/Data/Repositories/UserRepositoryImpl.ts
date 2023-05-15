import UserEntity from "App/Domain/Entities/UserEntity";
import UserRepository from "App/Domain/Repositories/Abstract/UserRepository";
import { Query } from "App/Domain/Repositories/Abstract/UserRepository/Query";
import UserDatasource from "App/Data/Datasources/Abstract/UserDatasource";
import UserDatasourceImpl  from "App/Data/Datasources/Local/UserLocalDatasourceImpl";
import User from "../Models/User";

export default class UserRepositoryImpl implements UserRepository {
    private userDatasource: UserDatasource;

    constructor() {
        this.userDatasource = new UserDatasourceImpl();
    }

    async findById(
        id: string,
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity | null> {
        const user = await this.userDatasource.findById(id);
        if (user === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const userEntity = UserEntity.fromJson(user.toJsonForEntity());  
        return new Promise((resolve) => {
            resolve(userEntity);
        });
    }

    async findByIds(
        ids: string[],
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity[]> {
        const users = await this.userDatasource.findByIds(ids);
        if (users.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const userEntities = users.map((user) => {
            return UserEntity.fromJson(user.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(userEntities);
        });
    }

    async findByUsername(
        username: string,
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity | null> {
        const user = await this.userDatasource.findByUsername(username);
        if (user === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const userEntity = UserEntity.fromJson(user.toJsonForEntity());
       
        return new Promise((resolve) => {
            resolve(userEntity);
        });
    }

    async findByUsernames(
        usernames: string[],
        _?: { [key: string]: any }
    ): Promise<UserEntity[]>{
        const users = await this.userDatasource.findByUsernames(usernames);
        if (users.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const userEntities = users.map((user) => {
            return UserEntity.fromJson(user.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(userEntities);
        });
    }

    async findByEmail(
        email: string,
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity | null> {
        const user = await this.userDatasource.findByEmail(email);
        if (user === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const userEntity = UserEntity.fromJson(user.toJsonForEntity());
        
        return new Promise((resolve) => {
            resolve(userEntity);
        });
    }

    async findByEmails(
        emails: string[],
        _?: { [key: string]: any }
    ): Promise<UserEntity[]>{
        const users = await this.userDatasource.findByEmails(emails);
        if (users.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const userEntities = users.map((user) => {
            return UserEntity.fromJson(user.toJsonForEntity());
        });
        return new Promise((resolve) => {
            resolve(userEntities);
        });
    }
    async findByUsernameOrEmail(
        usernameOrEmail: string,
        _?: { [key: string]: any }
    ): Promise<UserEntity | null>{
        const userByEmail = await this.userDatasource.findByEmail(usernameOrEmail);
        if (userByEmail === null) {
            const userByUsername = await this.userDatasource.findByUsername(usernameOrEmail);
            if (userByUsername === null) {
                return new Promise((resolve) => {
                    resolve(null);
                });
            }

            const userByUsernameEntity = UserEntity.fromJson(userByUsername.toJsonForEntity());
       
            return new Promise((resolve) => {
                resolve(userByUsernameEntity);
            });
        }
        const userByEmailEntity = UserEntity.fromJson(userByEmail.toJsonForEntity());
        
        return new Promise((resolve) => {
            resolve(userByEmailEntity);
        });
       
    }

    existsById(id: string): Promise<boolean> {
        return this.userDatasource.existsById(id);
    }

    existsByUserName(username: string): Promise<boolean> {
        return this.userDatasource.existsByUserName(username);
    }

    existsByEmail(email: string): Promise<boolean> {
        return this.userDatasource.existsByEmail(email);
    }

    async save(
        userEntity: UserEntity,
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity | null> {
        const user = User.fromJson(userEntity.toJsonForModel());
        const saved = await this.userDatasource.save(user);
        if (saved === null) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        const savedEntity = UserEntity.fromJson(saved.toJsonForEntity());
        
        return new Promise((resolve) => {
            resolve(savedEntity);
        });
    }

    public async update(
        userId: string,
        username: string,
        title:string,
        description: string | null,
    ): Promise<UserEntity> {
        const entity = await this.findById(userId);
        if (entity === null) {
            throw new Error(`Not found user ID:${userId}`);
        }

        entity.username = username;
        entity.description = description;
        entity.title = title;
      
        const updatedEntity = await this.save(entity);

        return new Promise((resolve) => {
            resolve(updatedEntity!);
        });
    }

    totalCount(query: Query): Promise<number> {
        const datasourceQuery = query.toDatasourceQuery();
        return this.userDatasource.totalCount(datasourceQuery);
    }

    async search(
        query: Query,
        _?: { [key: string]: any } | undefined
    ): Promise<UserEntity[]> {
        const datasourceQuery = query.toDatasourceQuery();
        const users = await this.userDatasource.search(datasourceQuery);
        if (users.length === 0) {
            return new Promise((resolve) => {
                resolve([]);
            });
        }
        const userEntities = users.map((user) => {
            return UserEntity.fromJson(user.toJsonForEntity());
        });
        
        return new Promise((resolve) => {
            resolve(userEntities);
        });
    }

    deleteById(id: string): Promise<void> {
        return this.userDatasource.deleteById(id);
    }

}
