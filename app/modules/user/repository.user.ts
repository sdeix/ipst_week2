import { eq } from "drizzle-orm";
import { DbConnection } from "../../common/config/drizzle-config";
import { users, UsersType } from "../../common/types/drizzle/schema";

export async function insert(con: DbConnection, entity: UsersType) {
    return await con
        .insert(users)
        .values(entity)
        .returning()
        .then((result) => result[0]);
}

export async function getByEmail(con: DbConnection, email: string) {
    return await con
        .select()
        .from(users)
        .where(eq(users.email, email))
        .then((result) => result[0]);
}

export async function getById(con: DbConnection, id: string) {
    return await con
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((result) => result[0]);
}
