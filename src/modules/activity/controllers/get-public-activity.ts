// src/routes/publicActivity.ts (ou similar)
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { makeFindActivityById } from "../services/factory/make-find-activity-by-id";

export async function getPublicActivity(request: FastifyRequest, reply: FastifyReply) {
  // Valida o token recebido via query string
  const querySchema = z.object({
    token: z.string()
  });
  const { token } = querySchema.parse(request.query);

  if (!process.env.JWT_SECRET) {
    return reply.status(500).send({ error: "JWT_SECRET not defined" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return reply.status(401).send({ error: "Token inválido ou expirado" });
  }

  // O payload tem a estrutura: { userId, activity: activityId, role, iat, exp }
  const activityId = (payload as any).activity;

  const findActivityByIdUseCase = makeFindActivityById();
  const activity = await findActivityByIdUseCase.handler(activityId);

  if (!activity) {
    return reply.status(404).send({ error: "Activity not found" });
  }

  // Retorne apenas os dados mínimos para renderizar a atividade
  return reply.status(200).send(activity);
}