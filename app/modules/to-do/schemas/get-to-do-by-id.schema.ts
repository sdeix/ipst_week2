import type { FastifySchema } from "fastify";
import { string, z } from "zod";

export const getToDoByIdSchema = z.object({
    id: string().uuid()
});

export type getToDoByIdQuery = z.infer<typeof getToDoByIdSchema>;
export const getToDoByIdFSchema: FastifySchema = { params: getToDoByIdSchema };
