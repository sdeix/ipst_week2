import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("user-objective-shares")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("userId", "uuid", (col) => col.notNull())
        .addColumn("objectiveId", "uuid", (col) => col.notNull())
        .addForeignKeyConstraint("fk_userId", ["userId"], "users", ["id"], (cb) => cb.onDelete("cascade"))
        .addForeignKeyConstraint("fk_objectiveId", ["objectiveId"], "objectives", ["id"], (cb) => cb.onDelete("cascade"))
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("user-objective-shares").execute();
}
