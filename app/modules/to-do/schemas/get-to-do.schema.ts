import type { FastifySchema } from "fastify";
import { z } from "zod";

export const querySchema = z.object({
    search: z.string().optional(),
    sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
    limit: z.coerce.number({ message: "Expected number" }).int().min(1).max(100).optional().default(10),
    offset: z.coerce.number().int().min(0).optional().default(0),
    isCompleted: z.enum(["true", "false"]).optional()
});

export type GetToDoQueryType = z.infer<typeof querySchema>;
export const getToDoFSchema: FastifySchema = { querystring: querySchema };

export interface IGetToDo {
    Querystring: GetToDoQueryType;
}
