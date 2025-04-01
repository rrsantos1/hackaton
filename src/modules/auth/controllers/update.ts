import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeFindUserById } from "../services/factory/make-find-user-by-id";
import { makeUpdateUser } from "../services/factory/make-update-user";

export async function updateUser(request: FastifyRequest, reply: FastifyReply) {
  // Valida o ID nos parâmetros da requisição
  const registerParamsSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = registerParamsSchema.parse(request.params);

  // Valida o corpo da requisição
  const registerBodySchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres").optional(),
    role: z.string().optional(),
  });

  const { name, email, password, role } = registerBodySchema.parse(request.body);

  const findUserByIdUseCase = makeFindUserById();
  
  const findUser = await findUserByIdUseCase.handler(id);
  
  if (!findUser) {
    return reply.status(404).send({ error: 'User not found' });
  }

  // Chama o caso de uso para atualizar o usuário
  const updateUserUseCase = makeUpdateUser();

  const user = await updateUserUseCase.handler({
    id,        
    name: name ?? findUser.name,
    email: email ?? findUser.email,
    password: password ?? findUser.password,
    role: role ?? findUser.role
  });

  return reply.status(200).send({ id: user?.id, name: user?.name, email: user?.email, role: user?.role});
}