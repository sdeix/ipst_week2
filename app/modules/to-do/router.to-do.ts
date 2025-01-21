import type { FastifyInstance } from "fastify";
import * as toDoController from "./controller.to-do";
import { getToDoFSchema } from "./schemas/get-to-do.schema";
import { createToDoFSchema } from "./schemas/create-to-do.schema";


export const toDoRouter = async (app: FastifyInstance) => {
    app.post("/", { schema: createToDoFSchema }, toDoController.create);
    app.get("/", { schema: getToDoFSchema }, toDoController.get);
};
