import type { FastifyReply, FastifyRequest } from "fastify";
import { sqlCon } from "../../common/config/kysely-config";
import { HttpStatusCode } from "../../common/enum/http-status-code";
import * as toDoRepository from "./repository.to-do";
import { getToDoQuery, getToDoQuerySchema } from "./schemas/get-to-do.schema";

// export async function create(req: FastifyRequest<{ Body: signUpSchema }>, rep: FastifyReply) {
//     return rep.code(HttpStatusCode.OK).send("data");
// }

export async function get(req: FastifyRequest, rep: FastifyReply) {
    const query: getToDoQuery = getToDoQuerySchema.parse(req.query);

    const data = await toDoRepository.getToDosByQuery(sqlCon, query, req.user.id!);

    return rep.code(HttpStatusCode.OK).send(data);
}
