import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from '../services/factory/make-create-activity';
import { generateCrosswordPuzzle } from "../../../shared/activities/crossword"; // Função que você deverá implementar
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";

export async function createCrosswordActivity(request: FastifyRequest, reply: FastifyReply) {
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
      // Esse campo pode ser redundante, pois o controller é específico para crossword
      type: z.literal("crossword"),
      // Configurações: número de linhas e colunas do grid (pode incluir outras configurações, como tempo)
      config: z.object({
          time: z.number().optional(),// Ex: 10 (minutos), se aplicável
          rows: z.number(), // Ex: 15
          cols: z.number(), // Ex: 15
      }),
      // Conteúdo: palavras e suas respectivas pistas
      content: z.object({
        words: z.array(
          z.object({
            word: z.string(), // A palavra que será posicionada no grid
            clue: z.string(), // A pista correspondente à palavra
          })
        ),
      })
    });

    // Valida os dados extraídos dos campos
    const dto = schema.parse({ ...fields, type: "crossword" });

    // Criando a atividade no banco de dados
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.CROSSWORD;
    activity.config = {
      rows: dto.config.rows,
      cols: dto.config.cols,
      // time: dto.config.time, // se estiver utilizando essa configuração
    };
    activity.coverImage = coverImageUrl; // URL da imagem processada

    // Chama a função utilitária para gerar o grid e as pistas das palavras cruzadas
    const { grid, clues } = generateCrosswordPuzzle(
      dto.content.words,
      dto.config.rows,
      dto.config.cols
    );

    // Armazena o resultado da geração no campo content
    activity.content = {
      words: dto.content.words,
      grid,
      clues,
    };

    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade de palavras cruzadas:", error);
    return reply.status(500).send({
      error: error.message ?? "Erro ao criar atividade de palavras cruzadas."
    });
  }
}