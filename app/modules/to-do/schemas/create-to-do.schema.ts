// import type { FastifySchema } from "fastify";
// import { z } from "zod";

// export const schema = z.object({
//     search: z.string().optional(),
//     sortBy: z.enum(["title", "createdAt", "notifyAt"]).optional().default("createdAt"),
//     sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
//     limit: z.number().int().min(1).max(100).optional().default(10),
//     offset: z.number().int().min(0).optional().default(0),
//     isCompleted: z.boolean().optional()
// });

// export type getToDoQuery = z.infer<typeof schema>;
// export const getToDoFSchema: FastifySchema = { querystring: schema };
