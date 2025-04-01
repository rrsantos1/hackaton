import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { appDataSource } from "../../../config/typeorm/typeorm";
import { makeCreateActivity } from "../services/factory/make-create-activity";
import { ActivityType } from "../entities/Activity";

export async function createActivity(request: FastifyRequest, reply: FastifyReply) {
  // Incluímos o campo coverImage (opcional)
  const registerBodySchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string(),
    type: z.enum(["quiz", "word_search", "crossword"]),
    config: z.any().optional(),
    content: z.any().optional(),
    coverImage: z.string().optional(),    
  });

  try {
    const { title, description, category, type, config, content, coverImage } = registerBodySchema.parse(request.body);
    // Incluímos o coverImage nos dados da atividade
    const activityData = { title, description, category, type: type as ActivityType, config, content, coverImage };

    const activity = await appDataSource.transaction(async (transactionalEntityManager) => {
      const createActivityService = makeCreateActivity(transactionalEntityManager);  
      const newActivity = await createActivityService.handler(activityData);

      if (!newActivity) {
        throw new Error("Falha na criação da atividade.");
      }     

      return newActivity;
    });

    return reply.status(201).send(activity);
  } catch (error: any) {
    console.error("Erro na criação da atividade:", error);
    return reply.status(500).send({ error: "Falha na criação da atividade. Tente novamente mais tarde." });
  }
}