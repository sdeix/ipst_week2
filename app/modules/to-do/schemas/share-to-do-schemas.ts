import type { FastifySchema } from "fastify";
import { z } from "zod";

const paramsSchema = z.object({
    id: z.string().uuid()
});
const bodySchema = z.object({
    userIds: z.string().uuid().array()
});

type ShareToDoBodyType = z.infer<typeof bodySchema>;
type ShareToDoParamsType = z.infer<typeof paramsSchema>;

export const shareToDoFSchema: FastifySchema = {
    body: bodySchema,
    params: paramsSchema
};

export interface IShareToDo {
    Body: ShareToDoBodyType;
    Params: ShareToDoParamsType;
}
