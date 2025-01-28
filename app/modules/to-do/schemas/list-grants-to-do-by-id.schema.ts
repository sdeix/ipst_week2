import type { FastifySchema } from "fastify";
import { string, z } from "zod";

export const schema = z.object({
    id: string().uuid()
});

export const listGrantsToDoFSchema: FastifySchema = { params: schema };
