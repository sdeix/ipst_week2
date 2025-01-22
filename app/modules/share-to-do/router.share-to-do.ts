import type { FastifyInstance } from "fastify";
import * as toDoController from "./controller.share-to-do";
import { shareToDoFSchema } from "./schemas/share-to-do.schema";

export const shareToDoRouter = async (app: FastifyInstance) => {
    app.get("/", {}, toDoController.get); // Получение всех заданий, к которым дан доступ другим пользователям
    app.post("/", { schema: shareToDoFSchema }, toDoController.share);
    // app.get("/:id", { schema: shareToDoFSchema }, toDoController.getById);
    // app.patch("/:id", { schema: shareToDoFSchema }, toDoController.update);
};
