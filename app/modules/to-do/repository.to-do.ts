import { expressionBuilder, ExpressionWrapper, type Insertable, type Kysely, RawBuilder, SqlBool, Transaction } from "kysely";
import { DB, Objectives } from "../../common/types/kysely/db.type";
import { GetToDoQueryType } from "./schemas/get-to-do.schema";
import { UpdateToDoType } from "./schemas/update-to-do.schema";

type InsertableObjectiveRowType = Insertable<Objectives>;

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
export async function getToDoById(con: Kysely<DB> | Transaction<DB>, id: string) {
    return await con.selectFrom("objectives").selectAll().where("id", "=", id).executeTakeFirst();
}
export async function var1GetToDosByQuery(con: Kysely<DB> | Transaction<DB>, query: GetToDoQueryType, userId: string) {
    return await con
        .selectFrom("objectives")
        .selectAll()
        .where((eb) =>
            eb.or([
                eb("creatorid", "=", userId),
                eb.exists(
                    con
                        .selectFrom("user-objective-shares")
                        .select("id")
                        .where("user-objective-shares.userId", "=", userId)
                        .whereRef("user-objective-shares.objectiveId", "=", "objectives.id" as any)
                )
            ])
        )
        .$if(query.search !== undefined, (qb) => qb.where("title", "ilike", `%${query.search}%`))
        .$if(query.isCompleted !== undefined, (qb) => qb.where("isCompleted", "=", query.isCompleted === "true" ? true : false))
        .orderBy(query.sortBy, query.sortOrder)
        .limit(query.limit)
        .offset(query.offset)
        .execute();
}
export async function var2GetToDosByQuery(con: Kysely<DB> | Transaction<DB>, query: GetToDoQueryType, userId: string) {
    return await con
        .selectFrom("objectives")
        .selectAll()
        .where((eb) =>
            eb.and([
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
                ...(query.search !== undefined ? [eb("title", "ilike", `%${query.search}%`)] : []),
                ...(query.isCompleted !== undefined ? [eb("isCompleted", "=", query.isCompleted === "true")] : [])
            ])
        )
        .orderBy(query.sortBy, query.sortOrder)
        .limit(query.limit)
        .offset(query.offset)
        .execute();
}
export async function var3GetToDosByQuery(con: Kysely<DB> | Transaction<DB>, query: GetToDoQueryType, userId: string) {
    let conditions = con
        .selectFrom("objectives")
        .selectAll()
        .where((eb) =>
            eb.or([
                eb("creatorid", "=", userId),
                eb.exists(
                    con
                        .selectFrom("user-objective-shares")
                        .select("id")
                        .where("user-objective-shares.userId", "=", userId)
                        .whereRef("user-objective-shares.objectiveId", "=", "objectives.id" as any)
                )
            ])
        );

    const filters: any[] = [];

    if (query.search) {
        filters.push((eb: any) => eb.where("title", "ilike", `%${query.search}%`));
    }

    if (query.isCompleted !== undefined) {
        const isCompletedBool = query.isCompleted === "true";
        filters.push((eb: any) => eb.where("isCompleted", "=", isCompletedBool));
    }

    filters.forEach((filter) => {
        conditions = filter(conditions);
    });

    return await conditions.orderBy(query.sortBy, query.sortOrder).limit(query.limit).offset(query.offset).execute();
}
//  четвёртый вариант не мой, взял только для тестов скорости, после удалю
export async function var4GetToDosByQuery(con: Kysely<DB> | Transaction<DB>, filters: GetToDoQueryType, userId: string) {
    const query = con.selectFrom("objectives").where((eb) =>
        eb.or([
            eb("creatorid", "=", userId),
            eb.exists(
                con
                    .selectFrom("user-objective-shares")
                    .select("id")
                    .where("user-objective-shares.userId", "=", userId)
                    .whereRef("user-objective-shares.objectiveId", "=", "objectives.id" as any)
            )
        ])
    );
    const conditions: Array<ExpressionWrapper<DB, "objectives", SqlBool> | RawBuilder<any>> = [];

    const eb = expressionBuilder<DB, "objectives">();
    if (filters.isCompleted !== undefined) conditions.push(eb("objectives.isCompleted", "=", true));
    if (filters.search !== undefined) conditions.push(eb("objectives.title", "ilike", `%${filters.search}%`));

    const dataQuery = await query
        .selectAll()
        .where((eb) => eb.and(conditions))
        .orderBy(filters.sortBy, filters.sortOrder)
        .limit(filters.limit)
        .offset(filters.offset)
        .execute();

    return dataQuery;
}
