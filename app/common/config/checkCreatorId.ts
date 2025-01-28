import { FastifyReply, FastifyRequest } from "fastify";
import * as toDoRepository from "../../modules/to-do/repository.to-do";
import { CustomException } from "../exceptions/custom-exception";
import { sqlCon } from "./kysely-config";

export const checkCreatorId = async (request: FastifyRequest, rep: FastifyReply) => {
    const { id } = request.params as { id: string };
    const data = await toDoRepository.getToDoById(sqlCon, id);

    if (data?.creatorid !== request.user.id) {
        throw new CustomException(403, "No access", { publicMessage: "No access" });
    }
    return true;
};
