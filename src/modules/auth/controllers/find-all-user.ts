import { FastifyRequest, FastifyReply } from "fastify"
import { z } from "zod"
import { makeFindAllUser } from "../services/factory/make-find-all-user-use-case"

export async function findAllUser(
    request: FastifyRequest, 
    reply: FastifyReply
) {
    const registerParamsSchema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10)
    })

    const { page, limit } = registerParamsSchema.parse(request.query)   

    const findAllUserUseCase = makeFindAllUser()

    const users = await findAllUserUseCase.handler(page, limit)

    if (!users) {
        return reply.status(404).send({ error: "No users found" })
    }

    // Mapeia os dados para retornar apenas id e nome
    const filteredUsers = users.map(user => {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        }
    })

    return reply.status(200).send(filteredUsers)
}