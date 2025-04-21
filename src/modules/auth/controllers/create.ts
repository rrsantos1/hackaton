import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { hash } from "bcryptjs";
import { appDataSource } from "../../../config/typeorm/typeorm";
import { makeCreateUser } from "../services/factory/make-create-user";

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    email: z.string().email(),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  });  

  try {
    const { name, email, password } = registerBodySchema.parse(request.body);
    console.log("createUser", name, email, password);
    const hashedPassword = await hash(password, 10);
    const userData = { name, email, password: hashedPassword };

    const user = await appDataSource.transaction(async (transactionalEntityManager) => {
      const createUserService = makeCreateUser(transactionalEntityManager);
      const newUser = await createUserService.handler(userData);

      if (!newUser) {
        throw new Error("Falha na criação do usuário.");
      }
      return newUser;
    })

    return reply.status(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
      message: "Usuário criado com sucesso.",
    });
  } catch (error: any) {
    console.error("Erro na criação do usuário:", error);
    return reply.status(500).send({ error: "Falha na criação do usuário. Tente novamente mais tarde." });
  }
}