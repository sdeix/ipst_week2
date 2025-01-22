import { type Insertable, type Kysely, Transaction } from "kysely";
import { DB, UserObjectiveShares } from "../../common/types/kysely/db.type";

type InsertableObjectiveRowType = Insertable<UserObjectiveShares>;

export async function get(con: Kysely<DB> | Transaction<DB>, userId: UserObjectiveShares["userId"]) {
    return await con
        .selectFrom("user-objective-shares")
        .innerJoin("objectives", "user-objective-shares.objectiveId", "objectives.id")
        .innerJoin("users", "user-objective-shares.userId", "users.id")
        .where("objectives.creatorid", "=", userId)
        .select([
            "user-objective-shares.id",
            "objectives.creatorid",
            "user-objective-shares.objectiveId",
            "objectives.title",
            "objectives.description",
            "objectives.isCompleted",
            "objectives.createdAt",
            "objectives.notifyAt",
            "objectives.updatedAt",
            "user-objective-shares.userId as sharedWithUserId",
            "users.name as sharedWithUserName"
        ])
        .execute();
}
