import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("objectives")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("title", "varchar(127)", (col) => col.notNull())
        .addColumn("description", "text")
        .addColumn("creatorid", "uuid", (col) => col.notNull()) //в приложеной схеме бд написано нижним регистром, хз ошибка ли, но на всякий оставил так
        .addColumn("notifyAt", "timestamp")
        .addColumn("createdAt", "timestamp", (col) => col.notNull())
        .addColumn("updatedAt", "timestamp", (col) => col.notNull())
        .addColumn("isCompleted", "boolean", (col) => col.defaultTo(false))
        .addForeignKeyConstraint("fk_creatorid", ["creatorid"], "users", ["id"], (cb) => cb.onDelete("cascade"))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("objectives").execute();
}
