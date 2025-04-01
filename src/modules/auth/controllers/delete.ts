// src/modules/auth/controllers/deleteUser.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { appDataSource } from "../../../config/typeorm/typeorm";
import { makeDeleteUser } from "../services/factory/make-delete-user";

export async function deleteUser(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = paramsSchema.parse(request.params);

  try {
    await appDataSource.transaction(async (transactionalEntityManager) => {
      const deleteUserUseCase = makeDeleteUser(transactionalEntityManager);
      await deleteUserUseCase.handler(id);
    });
    return reply.status(204).send();
  } catch (error: any) {
    console.error("Erro na exclusão do usuário:", error);
    return reply.status(500).send({ error: error.message ?? "Erro ao excluir usuário." });
  }
}