import { fastify, type FastifyReply, type FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/drizzle-config";
import { IHandlingResponseError } from "../../common/config/http-response";
// import { sqlCon } from "../../common/config/kysely-config";
import { sendEmail } from "../../common/config/node-mailer";
import { HandlingErrorType } from "../../common/enum/error-types";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import { getById as getUserById } from "../user/repository.user";
import * as toDoRepository from "./repository.to-do";
import type { CreateToDoType } from "./schemas/create-to-do.schema";
import { IGetToDo } from "./schemas/get-to-do.schema";
import { IRevokeToDo } from "./schemas/revoke-to-do.schema";
import { IShareToDo } from "./schemas/share-to-do-schemas";
import type { IUpdateToDo } from "./schemas/update-to-do.schema";

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

export async function update(req: FastifyRequest<IUpdateToDo>, rep: FastifyReply) {
    const { id } = req.params as { id: string };

    const insertedToDo = await toDoRepository.update(sqlCon, req.body, id);

    return rep.code(HttpStatusCode.OK).send(insertedToDo);
}

export async function get(req: FastifyRequest<IGetToDo>, rep: FastifyReply) {
    const data = await toDoRepository.GetToDosByQuery(sqlCon, req.query, req.user.id!);

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

export async function share(req: FastifyRequest<IShareToDo>, rep: FastifyReply) {
    const { id } = req.params as { id: string };
    const todo = await toDoRepository.getToDoById(fastify.db, id);

    let notFoundedUsers = [];

    if (!todo) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "objectiveId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    for (const userId of req.body.userIds) {
        const user = await getUserById(sqlCon, userId);

        if (!user) {
            notFoundedUsers.push(userId);
            continue;
        }
        const share = {
            objectiveId: id,
            userId: userId
        };
        await toDoRepository.share(sqlCon, share);
        await sendEmail({
            to: user.email,
            subject: "Получен доступ к задаче другого пользователя",
            text: `Пользователь с ID:${req.user.id} предоставил вам доступ к задаче с ID ${todo.id}`
        });
    }
    if (notFoundedUsers.length > 0) {
        return rep.code(HttpStatusCode.NOT_FOUND).send({
            message: "Not found users with id:",
            notFoundedUsers
        }); //не совсем понял как правильно тут передать ошибку, приводить массив к строке, либо использовать такую передачу
    }
    return rep.code(HttpStatusCode.CREATED).send({ result: "Task successfully shared with users" });
}

export async function revoke(req: FastifyRequest<IRevokeToDo>, rep: FastifyReply) {
    const { id } = req.params as { id: string };
    const todo = await toDoRepository.getToDoById(sqlCon, id);
    if (!todo) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "objectiveId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    const deleted = await toDoRepository.revoke(sqlCon, id, req.body.userIds);
    if (!Number(deleted.numDeletedRows)) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "share objectiveId or userIds" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    return rep.code(HttpStatusCode.OK).send({ result: "deleted" });
}
export async function listGrants(req: FastifyRequest, rep: FastifyReply) {
    const { id } = req.params as { id: string };

    const todo = await toDoRepository.getToDoById(sqlCon, id);
    if (!todo) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Found, property: "objectiveId" };
        return rep.code(HttpStatusCode.NOT_FOUND).send(info);
    }

    const data = await toDoRepository.listGrants(sqlCon, id);
    return rep.code(HttpStatusCode.OK).send(data);
}
