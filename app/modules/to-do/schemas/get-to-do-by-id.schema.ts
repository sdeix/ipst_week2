import { z } from "zod";

export const getToDoByIdSchema = z.string().uuid();
