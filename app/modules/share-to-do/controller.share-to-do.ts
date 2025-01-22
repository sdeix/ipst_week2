import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as toDoRepository from "./repository.share-to-do";
import type { shareToDoSchema } from "./schemas/share-to-do.schema";

export async function get(req: FastifyRequest, rep: FastifyReply) {
    const data = await toDoRepository.get(sqlCon, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
