import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import { UserRole } from "App/Data/Enums/User";
export default class extends BaseSchema {
    protected tableName = "users";

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid("id").primary();
            table.string("full_name", 191).notNullable();
            table.string("username", 191).notNullable().unique();
            table.string("email").notNullable().unique();
            table.string("change_email").nullable().unique();
            table.boolean("verified").notNullable().defaultTo(false);
            table.string("avatar_id").nullable();
            table.string("avatar_url").nullable();
            table.string("title").nullable();
            table
                .enum("role", Object.values(UserRole))
                .defaultTo(UserRole.USER)
                .notNullable();
            table.text("description").nullable();
            table.integer("language_id").unsigned().notNullable();
            table.string("password", 180).notNullable();
            table.string("remember_me_token").nullable();
            table.string("reset_password_token").nullable();
            table.string("email_verification_token").nullable();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table
                .timestamp("reset_password_expire", { useTz: true })
                .nullable();
            table
                .timestamp("email_verification_expire", { useTz: true })
                .nullable();
            table.timestamp("last_accessed_at", { useTz: true }).nullable();
            table.timestamp("created_at", { useTz: true }).nullable();
            table.timestamp("updated_at", { useTz: true }).nullable();
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
