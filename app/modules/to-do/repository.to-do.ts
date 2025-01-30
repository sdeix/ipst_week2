import { eq } from "drizzle-orm";
import { type Insertable, type Kysely, OperandExpression, SqlBool, Transaction } from "kysely";
import { DbConnection } from "../../common/config/drizzle-config";
import { objectives } from "../../common/types/drizzle/schema";
import { DB, Objectives, UserObjectiveShares } from "../../common/types/kysely/db.type";
import { GetToDoQueryType } from "./schemas/get-to-do.schema";
import { UpdateToDoType } from "./schemas/update-to-do.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;
type InsertableShareRowType = Insertable<UserObjectiveShares>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}
export async function update(con: Kysely<DB> | Transaction<DB>, entity: UpdateToDoType, id: string) {
    return await con
        .updateTable("objectives")
        .set({
            ...entity,
            updatedAt: new Date()
        })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();
}
export async function getToDoById(con: DbConnection, id: string) {
    return await con.select().from(objectives).where(eq(objectives.id, id));
}
export async function GetToDosByQuery(con: Kysely<DB> | Transaction<DB>, query: GetToDoQueryType, userId: string) {
    return await con
        .selectFrom("objectives")
        .selectAll()
        .where((eb) => {
            const conditions = [
                eb.or([
                    eb("creatorid", "=", userId),
                    eb.exists(
                        con
                            .selectFrom("user-objective-shares")
                            .select("id")
                            .where("user-objective-shares.userId", "=", userId)
                            .whereRef("user-objective-shares.objectiveId", "=", "objectives.id" as any)
                    )
                ]),
                query.search ? eb("title", "ilike", `%${query.search}%`) : null,
                query.isCompleted !== undefined ? eb("isCompleted", "=", query.isCompleted === "true") : null
            ].filter(Boolean);

            return eb.and(conditions as OperandExpression<SqlBool>[]);
        })
        .orderBy(query.sortBy, query.sortOrder)
        .limit(query.limit)
        .offset(query.offset)
        .execute();
}
export async function share(con: Kysely<DB> | Transaction<DB>, entity: InsertableShareRowType) {
    return await con.insertInto("user-objective-shares").returningAll().values(entity).executeTakeFirstOrThrow();
}
export async function revoke(con: Kysely<DB> | Transaction<DB>, id: string, userId: string[]) {
    return await con.deleteFrom("user-objective-shares").where("objectiveId", "=", id).where("userId", "in", userId).executeTakeFirst();
}
export async function listGrants(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("user-objective-shares").select("userId").where("objectiveId", "=", id).execute();
}
