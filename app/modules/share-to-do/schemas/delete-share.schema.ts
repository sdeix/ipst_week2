import type { FastifySchema } from "fastify";
import { string, z } from "zod";

export const deleteShareSchema = z.object({
    id: string().uuid()
});

export type deleteShareQuery = z.infer<typeof deleteShareSchema>;
export const deleteShareFSchema: FastifySchema = { params: deleteShareSchema };