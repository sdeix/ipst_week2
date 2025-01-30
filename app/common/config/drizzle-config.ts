import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";
import * as schema from "../types/drizzle/schema";
import { logger } from "./pino-plugin";

export type DbConnection = NodePgDatabase<typeof schema>;
declare module "fastify" {
    interface FastifyInstance {
        db: DbConnection;
    }
}

export let sqlCon: DbConnection;

export const DrizzleConfig: FastifyPluginAsync = fp(async (fastify: FastifyInstance): Promise<void> => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    const db = drizzle(pool, { schema });
    sqlCon = db;

    logger.info("[Drizzle]: Database connected");
    fastify.decorate("db", db);

    fastify.addHook("onClose", async () => {
        await pool.end();
        logger.info("[Drizzle]: Connection closed");
    });
});
