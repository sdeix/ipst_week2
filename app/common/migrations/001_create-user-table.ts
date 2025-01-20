import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
    await db.schema
        .createTable("users")
        .addColumn("id", "uuid", (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
        .addColumn("password", "text", (col) => col.notNull())
        .addColumn("login", "varchar(127)", (col) => col.notNull())
        .addColumn("name", "varchar(12)", (col) => col.notNull())
        .addColumn("email", "varchar(127)", (col) => col.unique().notNull())
        .execute();
}

export async function down(db: Kysely<any>) {
    await db.schema.dropTable("users").execute();
}
