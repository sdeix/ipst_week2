import type { FastifyInstance } from "fastify";
import * as ShareToDoController from "./controller.share-to-do";
import { deleteShareFSchema } from "./schemas/delete-share.schema";
import { shareToDoFSchema } from "./schemas/share-to-do.schema";

export const shareToDoRouter = async (app: FastifyInstance) => {
    app.get("/", {}, ShareToDoController.get); // Получение всех заданий, к которым дан доступ другим пользователям
    app.post("/", { schema: shareToDoFSchema }, ShareToDoController.share); // Добавление доступа пользователю
    app.delete("/:id", { schema: deleteShareFSchema }, ShareToDoController.remove); // Удаление доступа к заданию по id
    // app.get("/:id", { schema: shareToDoFSchema }, toDoController.getById);
    // app.patch("/:id", { schema: shareToDoFSchema }, toDoController.update);
};
