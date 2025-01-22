import type { FastifyInstance } from "fastify";
import * as toDoController from "./controller.share-to-do";
import { shareToDoFSchema } from "./schemas/share.schema";

export const shareToDoRouter = async (app: FastifyInstance) => {
    app.get("/", {}, toDoController.get); // Получение всех заданий, к которым дан доступ другим пользователям
    // app.get("/:id", { schema: shareToDoFSchema }, toDoController.getById);
    // app.post("/", { schema: shareToDoFSchema }, toDoController.create);
    // app.patch("/:id", { schema: shareToDoFSchema }, toDoController.update);
};
