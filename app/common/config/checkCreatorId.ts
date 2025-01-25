import { FastifyReply, FastifyRequest } from "fastify";
import * as toDoRepository from "../../modules/to-do/repository.to-do";
import { HandlingErrorType } from "../enum/error-types";
import { HttpStatusCode } from "../enum/http-status-code";
import { IHandlingResponseError } from "./http-response";
import { sqlCon } from "./kysely-config";

export const checkCreatorId = async (request: FastifyRequest, rep: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = await toDoRepository.getToDoById(sqlCon, id);

    if (data?.creatorid !== request.user.id) {
        const info: IHandlingResponseError = { type: HandlingErrorType.Allowed, property: "userId" };
        return rep.code(HttpStatusCode.NOT_ACCEPTABLE).send(info);
    }
    return true;
};
