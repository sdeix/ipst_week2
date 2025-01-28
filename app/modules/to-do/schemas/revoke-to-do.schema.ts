import type { FastifySchema } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid()
});
const bodySchema = z.object({
    userIds: z.string().uuid().array()
});

type RevokeToDoBodyType = z.infer<typeof bodySchema>;
type RevokeToDoParamsType = z.infer<typeof paramsSchema>;

export const revokeToDoFSchema: FastifySchema = {
    body: bodySchema,
    params: paramsSchema
};

export interface IRevokeToDo {
    Body: RevokeToDoBodyType;
    Params: RevokeToDoParamsType;
}
