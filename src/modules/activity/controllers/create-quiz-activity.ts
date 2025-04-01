import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from '../services/factory/make-create-activity';
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";

export async function createQuizActivity(request: FastifyRequest, reply: FastifyReply) {
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
      type: z.literal("quiz"),
      config: z.object({
        time: z.number().optional(), // Tempo limite em minutos (se aplicável)
        shuffleQuestions: z.boolean().optional(), // Se as perguntas devem ser embaralhadas
      }),
      content: z.object({
        questions: z.array(
          z.object({
            question: z.string(), // Enunciado da pergunta
            options: z.array(z.string()), // Alternativas de resposta
            correctAnswer: z.string(), // Resposta correta
          })
        ),
      }),
    });

    // Valida os dados extraídos dos campos
    const dto = schema.parse({
      ...fields,
      type: "quiz", // Garante que `type` está correto, caso venha ausente
    });

    // Cria a instância da atividade
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.QUIZ;
    activity.config = dto.config;
    activity.content = dto.content;
    activity.coverImage = coverImageUrl;

    // Chama o serviço para salvar a atividade
    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade de quiz:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao criar atividade de quiz." });
  }
}