import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindActivityById } from "../services/factory/make-find-activity-by-id";
import { sendActivityAccessEmail } from "../../../shared/utils/emailService";

export async function publicActivity(request: FastifyRequest, reply: FastifyReply) { 
    const registerParamsSchema = z.object({ 
        activityId: z.coerce.number()        
    });
    const { activityId } = registerParamsSchema.parse(request.params);

    // Corpo da requisição: userId, email e name
    const registerBodySchema = z.object({
        userId: z.coerce.number(),
        email: z.string().email(),
        name: z.string()
    });
    const { userId, email, name } = registerBodySchema.parse(request.body);

    const findActivityByIdUseCase = makeFindActivityById();
    const activity = await findActivityByIdUseCase.handler(activityId);

    if (!activity) {
        return reply.status(404).send({ error: 'Activity not found' });
    }

    // Gera o token único de acesso com validade de 7 dias
    const uniqueToken = await reply.jwtSign(
        { userId, activity: activityId, role: "guest" },
        { expiresIn: '7d' }
    );      

    // Define a URL base (por exemplo, via variável de ambiente)
    const baseUrl = process.env.APP_URL ?? 'http://localhost:3000';
    const accessLink = `${baseUrl}/public/activity?token=${uniqueToken}`;

    try {
        await sendActivityAccessEmail(email, String(userId), name, accessLink);
        return reply.status(200).send({ message: "E-mail enviado com sucesso", accessLink });
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        return reply.status(500).send({ error: "Erro ao enviar e-mail" });
    }
}