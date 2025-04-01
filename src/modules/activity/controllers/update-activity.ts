import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindActivityById } from "../services/factory/make-find-activity-by-id";
import { makeUpdateActivity } from "../services/factory/make-update-activity";
import { ActivityType } from "../entities/Activity";

export async function updateActivity(request: FastifyRequest, reply: FastifyReply) {
  // Valida o ID nos parâmetros da requisição
  const registerParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = registerParamsSchema.parse(request.params);

  // Valida o corpo da requisição
  const registerBodySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    type: z.nativeEnum(ActivityType).optional(),
    config: z.any().optional(),
    content: z.any().optional(),
    coverImage: z.string().optional(),
  });

  const { title, description, category, type, config, content, coverImage } = registerBodySchema.parse(request.body);

  const findActivityByIdUseCase = makeFindActivityById();
  
  const findActivity = await findActivityByIdUseCase.handler(id);
  
  if (!findActivity) {
    return reply.status(404).send({ error: 'Activity not found' });
  }

  // Chama o caso de uso para atualizar o usuário
  const updateActivityUseCase = makeUpdateActivity();

  const activity = await updateActivityUseCase.handler({
    id,
    title: title ?? findActivity.title,
    description: description ?? findActivity.description,
    category: category ?? findActivity.category,
    type: type ?? findActivity.type,
    config: config ?? findActivity.config,
    content: content ?? findActivity.content,
    coverImage: coverImage ?? findActivity.coverImage,    
  });

  return reply.status(200).send(activity);
}