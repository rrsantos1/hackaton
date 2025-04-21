import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Activity, ActivityType } from "../entities/Activity";
import { makeCreateActivity } from "../services/factory/make-create-activity";
import { processCoverImageUpload } from "../../../shared/utils/processCoverImageUpload";
import { makeFindUserById } from "../../auth/services/factory/make-find-user-by-id";

export async function createSentenceOrderActivity(request: FastifyRequest, reply: FastifyReply) {
  try {
    // Processa o multipart e extrai os campos, incluindo a imagem de capa se houver.
    const { fields, coverImageUrl } = await processCoverImageUpload(request);

    // Converte os campos config e content de string para objeto
    fields.config = fields.config ? JSON.parse(fields.config) : undefined;
    fields.content = fields.content ? JSON.parse(fields.content) : undefined;

    // Esquema de validação para a atividade de ordenação de palavras
    const schema = z.object({
      title: z.string(),
      description: z.string().optional(),
      category: z.string(),
      type: z.literal("sentence_order"),
      config: z.object({
        timeLimit: z.number().optional(),  // tempo limite em minutos para a atividade
      }),
      content: z.object({
        questions: z.array(z.string()),
        scoring: z.object({
          pointPerWord: z.number(),       // pontos por palavra correta
          bonusFullSentence: z.number(),  // bônus ao montar a frase inteira sem erro
          bonusFastFinish: z.number(),    // bônus adicional se todas as frases forem concluídas em tempo rápido
          timeLimitForBonus: z.number(),  // tempo (minutos) para ganhar o bônus rápido
        }),
        uiSettings: z.object({
          startButton: z.boolean(),       // botão de iniciar
          resetButton: z.boolean(),       // botão de reinício
          backButton: z.boolean(),        // botão de voltar
          animation: z.object({
            confetti: z.boolean(),        // animação de confete
            blinkingPerfect: z.boolean(), // efeito de "perfect" piscando
          }),
        }),
      }),
    });

    // Valida os dados extraídos
    const dto = schema.parse({ ...fields, type: "sentence_order" });

    // Recupera o ID do usuário autenticado
    const userId = (request.user as { user_id: number })?.user_id;
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }
    
    const findUserByIdUseCase = makeFindUserById();
    const user = await findUserByIdUseCase.handler(userId);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
        
    // Cria a atividade utilizando a entidade
    const activity = new Activity();
    activity.title = dto.title;
    activity.description = dto.description;
    activity.category = dto.category;
    activity.type = ActivityType.SENTENCE_ORDER; // considere que exista uma constante para esse tipo
    activity.config = dto.config;
    activity.content = dto.content;
    activity.coverImage = coverImageUrl; // URL da imagem processada

    // Salva a atividade utilizando o service de criação
    const createActivityService = makeCreateActivity();
    const newActivity = await createActivityService.handler(activity);

    return reply.status(201).send(newActivity);
  } catch (error: any) {
    console.error("Erro ao criar atividade de ordenação de palavras:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao criar atividade." });
  }
}