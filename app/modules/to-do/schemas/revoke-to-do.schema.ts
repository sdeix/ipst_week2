import type { FastifySchema } from "fastify";
import { string, z } from "zod";

const schema = z.object({
    id: string().uuid()
});

export type revokeToDoType = z.infer<typeof schema>;
export const revokeToDoFSchema: FastifySchema = { params: schema };
