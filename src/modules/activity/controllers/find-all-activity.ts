import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeFindAllActivity } from "../services/factory/make-find-all-activity-use-case"

export async function findAllActivity(
    request: FastifyRequest, 
    reply: FastifyReply
) {
    const registerParamsSchema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10000)
    })

    const { page, limit } = registerParamsSchema.parse(request.query)

    const findAllActivityUseCase = makeFindAllActivity()

    const activitys = await findAllActivityUseCase.handler(page, limit)

    if (!activitys) {
        return reply.status(404).send({ error: "No activitys found" })
    }   

    return reply.status(200).send(activitys)
}