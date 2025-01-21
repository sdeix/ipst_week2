import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1).max(127),
    description: z.string().nullable().optional(),
    notifyAt: z.string().datetime().nullable().optional(),
    isCompleted: z.boolean().nullable().optional()
});

export type createToDoSchema = z.infer<typeof schema>;
export const createToDoFSchema: FastifySchema = { body: schema };
