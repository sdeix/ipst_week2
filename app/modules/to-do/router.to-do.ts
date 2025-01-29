import type { FastifyInstance } from "fastify";
import { checkCreatorId } from "../../common/config/checkCreatorId";
import * as toDoController from "./controller.to-do";
import { createToDoFSchema } from "./schemas/create-to-do.schema";
import { getToDoByIdFSchema } from "./schemas/get-to-do-by-id.schema";
import { getToDoFSchema } from "./schemas/get-to-do.schema";
import { listGrantsToDoFSchema } from "./schemas/list-grants-to-do-by-id.schema";
import { revokeToDoFSchema } from "./schemas/revoke-to-do.schema";
import { shareToDoFSchema } from "./schemas/share-to-do-schemas";
import { updateToDoFSchema } from "./schemas/update-to-do.schema";

export const toDoRouter = async (app: FastifyInstance) => {
    app.get("/", { schema: getToDoFSchema }, toDoController.get);
    app.get("/:id", { schema: getToDoByIdFSchema, preHandler: app.auth([checkCreatorId]) }, toDoController.getById);
    app.post("/", { schema: createToDoFSchema }, toDoController.create);
    app.patch("/:id", { schema: updateToDoFSchema, preHandler: app.auth([checkCreatorId]) }, toDoController.update);
    app.post("/:id/share", { schema: shareToDoFSchema, preHandler: app.auth([checkCreatorId]) }, toDoController.share);
    app.delete("/:id/revoke", { schema: revokeToDoFSchema, preHandler: app.auth([checkCreatorId]) }, toDoController.revoke);
    app.get("/:id/list-grants", { schema: listGrantsToDoFSchema, preHandler: app.auth([checkCreatorId]) }, toDoController.listGrants);
};
