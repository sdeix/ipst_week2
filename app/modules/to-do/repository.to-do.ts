import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { getToDoQuery } from "./schemas/get-to-do.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

export async function insert(con: Kysely<DB> | Transaction<DB>, entity: InsertableObjectiveRowType) {
    return await con.insertInto("objectives").returningAll().values(entity).executeTakeFirstOrThrow();
}
export async function update(con: Kysely<DB> | Transaction<DB>, entity: object, id: string) {
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
export async function getToDoById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}
export async function getToDosByQuery(con: Kysely<DB> | Transaction<DB>, query: getToDoQuery, userId: Objectives["creatorid"]) {
    return await con
        .selectFrom("objectives")
        .selectAll()
        .where((eb) =>
            eb.or([
                // Условие 1: задания, созданные пользователем
                eb("creatorid", "=", userId),
                // Условие 2: задания, доступные через user-objective-shares
                eb.exists(
                    con
                        .selectFrom("user-objective-shares")
                        .select("id")
                        .where("user-objective-shares.userId", "=", userId)
                        .whereRef("user-objective-shares.objectiveId", "=", "objectives.id" as any)
                )
            ])
        )
        .$if(query.search !== undefined, (qb) => qb.where("title", "like", `%${query.search}%`))
        .$if(query.isCompleted !== undefined, (qb) => qb.where("isCompleted", "=", query.isCompleted === "true" ? true : false))
        .$if(query.sortBy !== undefined, (qb) => qb.orderBy(query.sortBy, query.sortOrder || "asc"))
        .limit(query.limit)
        .offset(query.offset)
        .execute();
}
