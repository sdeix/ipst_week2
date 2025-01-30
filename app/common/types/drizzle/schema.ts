import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const objectives = pgTable("objectives", {
    id: uuid("id").defaultRandom().primaryKey(),
    creatorId: uuid("creatorid").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    isCompleted: boolean("isCompleted"),
    notifyAt: timestamp("notifyAt", { mode: "date" }),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull()
});

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    login: text("login").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull()
});

export const userObjectiveShares = pgTable("user-objective-shares", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    objectiveId: uuid("objectiveId")
        .notNull()
        .references(() => objectives.id, { onDelete: "cascade" })
});

// RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
    sharedObjectives: many(userObjectiveShares)
}));

export const objectivesRelations = relations(objectives, ({ many }) => ({
    sharedUsers: many(userObjectiveShares)
}));

export const userObjectiveSharesRelations = relations(userObjectiveShares, ({ one }) => ({
    user: one(users, {
        fields: [userObjectiveShares.userId],
        references: [users.id]
    }),
    objective: one(objectives, {
        fields: [userObjectiveShares.objectiveId],
        references: [objectives.id]
    })
}));
