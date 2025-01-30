import { and, asc, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { DbConnection } from "../../common/config/drizzle-config";
import { objectives, ObjectivesType, userObjectiveShares, UserObjectiveSharesType, users } from "../../common/types/drizzle/schema";
import { GetToDoQueryType } from "./schemas/get-to-do.schema";
import { UpdateToDoType } from "./schemas/update-to-do.schema";

export async function insert(con: DbConnection, entity: ObjectivesType) {
    return await con
        .insert(objectives)
        .values(entity)
        .returning()
        .then((result) => result[0]);
}
export async function update(con: DbConnection, entity: UpdateToDoType, id: string) {
    return await con
        .update(objectives)
        .set({ ...entity, updatedAt: new Date().toISOString() })
        .where(eq(objectives.id, id))
        .returning()
        .then((result) => result[0]);
}
export async function getToDoById(con: DbConnection, id: string) {
    return await con
        .select()
        .from(objectives)
        .where(eq(objectives.id, id))
        .then((result) => result[0]);
}
export async function GetToDosByQuery(con: DbConnection, query: GetToDoQueryType, userId: string) {
    const sortOrder = query.sortOrder === "desc" ? desc : asc;
    console.log(query.search);
    return await con
        .select()
        .from(objectives)
        .where(
            and(
                or(
                    eq(objectives.creatorId, userId),
                    inArray(objectives.id, (await con.select({ id: userObjectiveShares.objectiveId })).from(userObjectiveShares).where(eq(userObjectiveShares.userId, userId)))
                ),
                query.search ? ilike(objectives.title, `%${query.search}%`) : undefined,
                query.isCompleted ? eq(objectives.isCompleted, query.isCompleted === "true") : undefined
            )
        )
        .orderBy(sortOrder(objectives[query.sortBy]))
        .limit(query.limit)
        .offset(query.offset);
}
export async function share(con: DbConnection, entity: UserObjectiveSharesType) {
    return await con.insert(userObjectiveShares).values(entity);
}
export async function revoke(con: DbConnection, id: string, userId: string[]) {
    return await con.delete(userObjectiveShares).where(and(eq(userObjectiveShares.objectiveId, id), inArray(userObjectiveShares.userId, userId)));
}
export async function listGrants(con: DbConnection, id: string) {
    return await con.select({ userId: users.id }).from(userObjectiveShares).where(eq(objectives.id, id));
}
