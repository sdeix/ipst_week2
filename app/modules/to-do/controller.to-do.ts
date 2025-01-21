import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as toDoRepository from "./repository.to-do";
import type { createToDoSchema } from "./schemas/create-to-do.schema";
import { getToDoQuery, getToDoQuerySchema } from "./schemas/get-to-do.schema";

export async function create(req: FastifyRequest<{ Body: createToDoSchema }>, rep: FastifyReply) {
    const todo = {
        title: req.body.title,
        description: req.body.description,
        creatorid: req.user.id!,
        notifyAt: req.body.notifyAt,
        isCompleted: req.body.isCompleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const insertedToDo = await toDoRepository.insert(sqlCon, todo);

    return rep.code(HttpStatusCode.OK).send(insertedToDo);
}

export async function update(req: FastifyRequest<{ Body: createToDoSchema }>, rep: FastifyReply) {
    const todo = {
        title: req.body.title,
        description: req.body.description,
        creatorid: req.user.id!,
        notifyAt: req.body.notifyAt,
        isCompleted: req.body.isCompleted,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const insertedToDo = await toDoRepository.insert(sqlCon, todo);

    return rep.code(HttpStatusCode.OK).send(insertedToDo);
}

export async function get(req: FastifyRequest, rep: FastifyReply) {
    const query: getToDoQuery = getToDoQuerySchema.parse(req.query);

    const data = await toDoRepository.getToDosByQuery(sqlCon, query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}

export async function getById(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string };

    const data = await toDoRepository.getToDoById(sqlCon, id);

    return rep.code(HttpStatusCode.OK).send(data);
}
