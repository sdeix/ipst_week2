import type { FastifyInstance } from "fastify";
import * as toDoController from "./controller.to-do";
import { createToDoFSchema } from "./schemas/create-to-do.schema";
import { getToDoFSchema } from "./schemas/get-to-do.schema";
import { updateToDoFSchema } from "./schemas/update-to-do.schema";

export const toDoRouter = async (app: FastifyInstance) => {
    app.get("/", { schema: getToDoFSchema }, toDoController.get);
    app.get("/:id", {}, toDoController.getById);
    app.post("/", { schema: createToDoFSchema }, toDoController.create);
    app.patch("/:id", { schema: updateToDoFSchema }, toDoController.update);
};
