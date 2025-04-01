import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from "../services/factory/make-create-activity";
import { generateWordSearchPuzzle } from "../../../shared/activities/wordSearch";
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";

export async function createWordSearchActivity(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Processa o multipart e extrai os campos
    const { fields, coverImageUrl } = await processCoverImageUpload(request);

    // Converta `config` e `content` de string para objeto
    fields.config = fields.config ? JSON.parse(fields.config) : undefined;
    fields.content = fields.content ? JSON.parse(fields.content) : undefined;

    // Validação com Zod
    const schema = z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.string(),
      type: z.literal("word_search"),
      config: z.object({
        time: z.coerce.number(),
        rows: z.coerce.number(),
        cols: z.coerce.number(),
      }),
      content: z.object({
        words: z.preprocess(
          (val) => {
            if (typeof val === "string") return val.split(",").map((s: string) => s.trim());
            return val;
          },
          z.array(z.string())
        ),
      }),
    });

    const dto = schema.parse(fields);

    // Criar a atividade
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.WORD_SEARCH;
    activity.coverImage = coverImageUrl; // Agora a imagem é armazenada corretamente
    activity.config = dto.config;
    activity.content = dto.content;

    // Gera o grid e as posições das palavras
    const { grid, wordPositions } = generateWordSearchPuzzle(
      dto.content.words,
      dto.config.rows,
      dto.config.cols
    );
    activity.content = {
      words: dto.content.words,
      grid,
      wordPositions,
    };

    // Chama o serviço para salvar no banco
    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade word search:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao criar atividade." });
  }
}