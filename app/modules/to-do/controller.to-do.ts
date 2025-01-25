import type { FastifyReply, FastifyRequest } from "fastify";
import { IHandlingResponseError } from "../../common/config/http-response";
import { sqlCon } from "../../common/config/kysely-config";
import { HandlingErrorType } from "../../common/enum/error-types";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as toDoRepository from "./repository.to-do";
import type { CreateToDoType } from "./schemas/create-to-do.schema";
import { IGetToDo } from "./schemas/get-to-do.schema";
import type { UpdateToDoType } from "./schemas/update-to-do.schema";

export async function create(req: FastifyRequest<{ Body: CreateToDoType }>, rep: FastifyReply) {
    const todo = {
        ...req.body,
        creatorid: req.user.id!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const insertedToDo = await toDoRepository.insert(sqlCon, todo);

    return rep.code(HttpStatusCode.CREATED).send(insertedToDo);
}

export async function update(req: FastifyRequest<{ Body: UpdateToDoType }>, rep: FastifyReply) {
    const { id } = req.params as { id: string };
    const todo = {
        title: req.body.title,
        description: req.body.description,
        notifyAt: req.body.notifyAt,
        isCompleted: req.body.isCompleted
    };

    const insertedToDo = await toDoRepository.update(sqlCon, todo, id);

    return rep.code(HttpStatusCode.OK).send(insertedToDo);
}

export async function var1Get(req: FastifyRequest<IGetToDo>, rep: FastifyReply) {
    const data = await toDoRepository.var1GetToDosByQuery(sqlCon, req.query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
export async function var2Get(req: FastifyRequest<IGetToDo>, rep: FastifyReply) {
    const data = await toDoRepository.var2GetToDosByQuery(sqlCon, req.query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
export async function var3Get(req: FastifyRequest<IGetToDo>, rep: FastifyReply) {
    const data = await toDoRepository.var3GetToDosByQuery(sqlCon, req.query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
export async function var4Get(req: FastifyRequest<IGetToDo>, rep: FastifyReply) {
    const data = await toDoRepository.var4GetToDosByQuery(sqlCon, req.query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
export async function getById(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string };

    const data = await toDoRepository.getToDoById(sqlCon, id);
    if (!data) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "objectiveId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }
    return rep.code(HttpStatusCode.OK).send(data);
}
