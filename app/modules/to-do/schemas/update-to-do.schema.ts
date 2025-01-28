import type { FastifySchema } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid()
});
const bodySchema = z.object({
    title: z.string().min(1).max(127).optional(),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().nullable().optional(),
    isCompleted: z.boolean().nullable().optional()
});

type UpdateToDoParamsType = z.infer<typeof paramsSchema>;
export type UpdateToDoType = z.infer<typeof bodySchema>;

export const updateToDoFSchema: FastifySchema = {
    body: bodySchema,
    params: paramsSchema
};

export interface IUpdateToDo {
    Body: UpdateToDoType;
    Params: UpdateToDoParamsType;
}
