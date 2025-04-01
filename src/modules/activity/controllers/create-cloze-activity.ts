import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from '../services/factory/make-create-activity';
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";

export async function createClozeActivity(request: FastifyRequest, reply: FastifyReply) {
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
      type: z.literal("cloze"),
      config: z.object({
        timeLimit: z.number().optional(),        // Tempo limite em minutos (se aplicável)
        shuffleQuestions: z.boolean().optional(), // Se as perguntas devem ser embaralhadas
      }),
      content: z.object({
        questions: z.array(
          z.object({
            // Frase com lacunas (os espaços para preenchimento podem ser representados por "_____" ou similar)
            sentence: z.string(),
            // Array com as respostas corretas para cada lacuna, na ordem em que aparecem
            correctAnswers: z.array(z.string()),
            // Opcionalmente, um array com palavras alternativas que o usuário pode utilizar para completar a frase
            options: z.array(z.string()).optional(),
          })
        ),
      })
    });

    // Valida os dados extraídos dos campos
    const dto = schema.parse({ ...fields, type: "cloze" });

    // Criando a atividade no banco de dados
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.CLOZE;
    activity.config = dto.config;
    activity.content = dto.content;
    activity.coverImage = coverImageUrl;

    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade de cloze:", error);
    return reply
      .status(500)
      .send({ error: error.message ?? "Erro ao criar atividade de cloze." });
  }
}