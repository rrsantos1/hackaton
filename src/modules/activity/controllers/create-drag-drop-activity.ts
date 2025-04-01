import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from '../services/factory/make-create-activity';
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";

export async function createDragDropActivity(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Processa o multipart e extrai os campos
    const { fields, coverImageUrl } = await processCoverImageUpload(request);

    // Converte `config` e `content` de string para objeto
    fields.config = fields.config ? JSON.parse(fields.config) : undefined;
    fields.content = fields.content ? JSON.parse(fields.content) : undefined;

    // Esquema de validação
    const schema = z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.string(),
      type: z.literal("drag_drop"),
      config: z.object({
        timeLimit: z.number().optional(),  // Tempo limite em minutos
        shufflePairs: z.boolean().optional(), // Se os pares devem ser embaralhados
      }),
      content: z.object({
        pairs: z.array(
          z.object({
            word: z.string(),       // Palavra em português
            translation: z.string() // Palavra correspondente em inglês
          })
        ),
      })
    });

    // Valida os dados extraídos dos campos
    const dto = schema.parse({ ...fields, type: "drag_drop" });

    // Criando a atividade no banco de dados
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.DRAG_DROP;
    activity.config = dto.config;
    activity.content = dto.content;
    activity.coverImage = coverImageUrl; // URL da imagem processada

    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade de drag_drop:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao criar atividade." });
  }
}