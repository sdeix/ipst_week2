import type { FastifySchema } from "fastify";
import { string, z } from "zod";

const paramsSchema = z.object({
    id: string().uuid()
});
const bodySchema = z.object({
    userId: string().uuid()
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
