import type { FastifySchema } from "fastify";
import { z } from "zod";

const schema = z.object({
    userId: z.string().uuid(),
    objectiveId: z.string().uuid()
});

export type shareToDoType = z.infer<typeof schema>;
export const shareToDoFSchema: FastifySchema = { body: schema };
