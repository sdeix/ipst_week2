import type { FastifySchema } from "fastify";
import { string, z } from "zod";

export const getToDoByIdSchema = z.object({
    id: string().uuid()
});

export type getToDoByIdType = z.infer<typeof getToDoByIdSchema>;
export const getToDoByIdFSchema: FastifySchema = { params: getToDoByIdSchema };
