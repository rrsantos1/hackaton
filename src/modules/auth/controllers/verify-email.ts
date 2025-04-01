import { FastifyRequest, FastifyReply } from "fastify";
import { app } from "../../../app";
import { UserRepository } from "../repositories/UserRepository";
import { makeUpdateUser } from "../services/factory/make-update-user";

export async function verifyEmail(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as { token: string };
  const token = query.token;

  if (!token) {
    return reply.redirect('/?verified=error');
  }

  try {
    if (!process.env.JWT_SECRET) {
      return reply.code(500).send({ message: "JWT secret is not defined" });
    }
    const decoded = app.jwt.verify(token) as { userId: string };
    const userId = Number(decoded.userId);

    const userRepository = new UserRepository();
    const user = await userRepository.findUserById(userId);

    if (!user) {
      return reply.code(404).redirect('/?verified=error');
    }

    if (user.isVerified) {
        return reply.code(400).redirect('/?verified=already');
    }

    const updateUserUseCase = makeUpdateUser();
    await updateUserUseCase.handler({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      isVerified: true
    });
    
    return reply.code(200).send({
      message: 'Email verified successfully',
      user: { id: user.id, name: user.name }
    });
  } catch (error) {
    return reply.code(400).redirect('/?verified=error');
  }
}