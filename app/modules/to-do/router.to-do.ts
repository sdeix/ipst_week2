import type { FastifyInstance } from "fastify";
import * as toDoController from "./controller.to-do";
import { getToDoFSchema } from "./schemas/get-to-do.schema";

export const toDoRouter = async (app: FastifyInstance) => {
    // app.post("/to-do", { schema: getToDoFSchema }, toDoController.create);
    app.get("/", { schema: getToDoFSchema }, toDoController.get);
};
