// src/modules/auth/controllers/deleteActivity.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { appDataSource } from "../../../config/typeorm/typeorm";
import { makeDeleteActivity } from "../services/factory/make-delete-activity";

export async function deleteActivity(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = paramsSchema.parse(request.params);

  try {
    await appDataSource.transaction(async (transactionalEntityManager) => {
      const deleteActivityUseCase = makeDeleteActivity(transactionalEntityManager);
      await deleteActivityUseCase.handler(id);
    });
    return reply.status(204).send();
  } catch (error: any) {
    console.error("Erro na exclusão da atividade:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao excluir atividade." });
  }
}