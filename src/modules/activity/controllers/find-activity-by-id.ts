import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindActivityById } from "../services/factory/make-find-activity-by-id";

export async function findActivityById(request: FastifyRequest, reply: FastifyReply) {  
    const registerParamsSchema = z.object({ 
        id: z.coerce.number()
    })

    const { id } = registerParamsSchema.parse(request.params);

    const findActivityByIdUseCase = makeFindActivityById();

    const activity = await findActivityByIdUseCase.handler(id);

    if (!activity) {
        return reply.status(404).send({ error: 'Activity not found' });
    }

    return reply.status(200).send(activity);    
}  