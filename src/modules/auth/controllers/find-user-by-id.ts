import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindUserById } from "../services/factory/make-find-user-by-id";
import { formatDate } from "../../../shared/utils/dateFormatter";

export async function findUserById(request: FastifyRequest, reply: FastifyReply) {  
    const registerParamsSchema = z.object({ 
        id: z.coerce.number()
    })

    const { id } = registerParamsSchema.parse(request.params);

    const findUserByIdUseCase = makeFindUserById();

    const user = await findUserByIdUseCase.handler(id);

    if (!user) {
        return reply.status(404).send({ error: 'User not found' });
    }

    return reply.status(200).send({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });    
}  