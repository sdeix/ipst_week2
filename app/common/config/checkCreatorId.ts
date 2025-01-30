import { FastifyRequest } from "fastify";
import * as toDoRepository from "../../modules/to-do/repository.to-do";
import { CustomException } from "../exceptions/custom-exception";
import { sqlCon } from "./drizzle-config";

export const checkCreatorId = async (request: FastifyRequest) => {
    const { id } = request.params as { id: string };
    const data = await toDoRepository.getToDoById(sqlCon, id);

    if (data?.creatorId !== request.user.id) {
        throw new CustomException(403, "No access", { publicMessage: "No access" });
    }
};
