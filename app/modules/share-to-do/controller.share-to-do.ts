import type { FastifyReply, FastifyRequest } from "fastify";
import type { IHandlingResponseError } from "../../common/config/http-response.ts";
import { sqlCon } from "../../common/config/kysely-config";
import { HandlingErrorType } from "../../common/enum/error-types";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { getToDoById } from "../to-do/repository.to-do";
import { getById } from "../user/repository.user";
import * as toDoRepository from "./repository.share-to-do";
import type { shareToDoSchema } from "./schemas/share-to-do.schema.ts";

export async function get(req: FastifyRequest, rep: FastifyReply) {
    const data = await toDoRepository.get(sqlCon, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
export async function share(req: FastifyRequest<{ Body: shareToDoSchema }>, rep: FastifyReply) {
    const todo = await getToDoById(sqlCon, req.body.objectiveId);
    const user = await getById(sqlCon, req.body.userId);
    if (!todo) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "objectiveId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }
    if (!user) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "userId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }
    if (todo.creatorid != req.user.id || req.user.id === req.body.userId) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Allowed, property: "userId" };
        return rep.code(HttpStatusCode.NOT_ACCEPTABLE).send(info);
    }

    const insertedToDo = await toDoRepository.insert(sqlCon, req.body);

    return rep.code(HttpStatusCode.OK).send(insertedToDo);
}
