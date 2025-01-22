import type { FastifyInstance } from "fastify";
import { toDoRouter } from "./to-do/router.to-do";
import { userRouter } from "./user/router.user";

interface IProvider {
    instance: (app: FastifyInstance) => Promise<void>;
    prefix: string;
}

export const HttpProvider: IProvider[] = [
    { instance: userRouter, prefix: "user" },
    { instance: toDoRouter, prefix: "to-do" }
];
