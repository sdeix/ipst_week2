import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127).optional(),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().nullable().optional(),
    isCompleted: z.boolean().nullable().optional()
});

export type UpdateToDoType = z.infer<typeof schema>;
export const updateToDoFSchema: FastifySchema = { body: schema };
