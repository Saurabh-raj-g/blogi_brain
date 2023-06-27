import BaseSchema from "@ioc:Adonis/Lucid/Schema";
import { PostStatus } from "App/Data/Enums/Post";
export default class extends BaseSchema {
    protected tableName = "posts";

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid("id").primary();
            table
                .uuid("user_id")
                .references("id")
                .inTable("users")
                .onDelete("CASCADE");
            table.integer("read_time").unsigned().nullable();
            table.string("read_time_type").nullable();
            table.text("title").notNullable();
            table
                .enum("status", Object.values(PostStatus))
                .defaultTo(PostStatus.PUBLIC)
                .notNullable();
            table.json("body").notNullable();

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp("created_at", { useTz: true });
            table.timestamp("updated_at", { useTz: true });
        });
    }

    public async down() {
        this.schema.dropTable(this.tableName);
    }
}
