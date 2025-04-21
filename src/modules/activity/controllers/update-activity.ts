import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindActivityById } from "../services/factory/make-find-activity-by-id";
import { makeUpdateActivity } from "../services/factory/make-update-activity";
import { ActivityType } from "../entities/Activity";
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";
import { generateWordSearchPuzzle } from "../../../shared/activities/wordSearch";
import { generateCrosswordPuzzle } from "../../../shared/activities/crossword";
import { makeFindUserById } from "../../auth/services/factory/make-find-user-by-id";

export async function updateActivity(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Valida o ID passado na rota
    const registerParamsSchema = z.object({
      id: z.coerce.number(),
    });
    const { id } = registerParamsSchema.parse(request.params);

    // Verifica o content-type da requisição
    const contentType = request.headers["content-type"] ?? "";
    let fields: Record<string, any> = {};
    let coverImageUrl = "";

    if (contentType.startsWith("multipart/")) {
      // Se for multipart, processa com a função específica
      const multipart = await processCoverImageUpload(request);
      fields = multipart.fields;
      coverImageUrl = multipart.coverImageUrl ?? "";
      // Converte campos "config" e "content", se enviados como string, para objeto
      fields.config = fields.config ? JSON.parse(fields.config) : undefined;
      fields.content = fields.content ? JSON.parse(fields.content) : undefined;
    } else {
      // Se não for multipart, assume que o corpo foi enviado como JSON
      fields = request.body as Record<string, any>;
    }

    // Atualiza o schema do corpo para incluir os campos extras
    const registerBodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
      type: z.nativeEnum(ActivityType).optional(),
      config: z.any().optional(),
      content: z.any().optional(),
      coverImage: z.string().optional(),
      words: z.string().optional(),
      rows: z.coerce.number().optional(),
      cols: z.coerce.number().optional(),
      clue: z.string().optional(),
      time: z.coerce.number().optional(),
    });

    const parsed = registerBodySchema.parse(fields);
    let { title, description, category, type, config, content, words, rows, cols, clue, time } = parsed;
    
    // Busca os dados atuais da atividade
    const findActivityByIdUseCase = makeFindActivityById();
    const findActivity = await findActivityByIdUseCase.handler(id);
    if (!findActivity) {
      return reply.status(404).send({ error: "Activity not found" });
    }    

    // Processamento específico para atividades WORD_SEARCH
    if (type === ActivityType.WORD_SEARCH) {
      const wordsArray =
        typeof words === "string"
          ? words.split(",").map((w) => w.trim()).filter((w) => w !== "")
          : [];
      time = time ?? (findActivity.config?.time ?? 10);
      rows = rows ?? (findActivity.config?.rows ?? 10);
      cols = cols ?? (findActivity.config?.cols ?? 10);
      const { grid, wordPositions } = generateWordSearchPuzzle(wordsArray, rows ?? 10, cols ?? 10);
      content = { words: wordsArray, grid, wordPositions };
      config = { time, rows, cols };
    }

    // Processamento específico para atividades CROSSWORD
    if (type === ActivityType.CROSSWORD) {
      const crosswordItems =
        content?.crosswordItems && Array.isArray(content.crosswordItems)
          ? content.crosswordItems
          : [];
      const wordsWithClues = crosswordItems.map((item: any) => ({
        word: item.word?.trim() ?? "",
        clue: item.clue?.trim() ?? "Sem dica",
      }));
      time = time ?? (findActivity.config?.time ?? 10);
      rows = rows ?? (findActivity.config?.rows ?? 10);
      cols = cols ?? (findActivity.config?.cols ?? 10);
      const { grid, clues: generatedClues } = generateCrosswordPuzzle(wordsWithClues, rows ?? 10, cols ?? 10);
      content = {
        words: wordsWithClues,
        grid,
        clues: generatedClues,
      };
      config = { time, rows, cols };
    }

    // Se algum campo não foi enviado, utiliza o valor atual da atividade
    title = title ?? findActivity.title;
    description = description ?? findActivity.description;
    category = category ?? findActivity.category;
    type = type ?? findActivity.type;
    config = config ?? findActivity.config;
    content = content ?? findActivity.content;

    // Para a imagem de capa: se um novo arquivo foi enviado, usa-o; caso contrário, mantém o atual
    const finalCoverImage = coverImageUrl || fields.coverImage || findActivity.coverImage;    

    const userId = (request.user as { user_id: number })?.user_id;
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }
        
    const findUserByIdUseCase = makeFindUserById();
    const user = await findUserByIdUseCase.handler(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    // Chama o caso de uso de update com os dados reunidos
    const updateActivityUseCase = makeUpdateActivity();
    const updatedActivity = await updateActivityUseCase.handler({
      id,
      title,
      description,
      category,
      type,
      config,
      content,
      coverImage: finalCoverImage,
    });

    return reply.status(200).send(updatedActivity);
  } catch (error: any) {
    console.error("Erro ao atualizar atividade", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao atualizar atividade" });
  }
}