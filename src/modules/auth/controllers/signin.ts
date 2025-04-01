import { FastifyRequest, FastifyReply } from 'fastify';
import { InvalidCredentialsError } from '../../../shared/errors/invalid-credentials-error';
import * as z from 'zod';
import { compare } from 'bcryptjs';
import { makeSignin } from '../services/factory/make-signin-use-case';

export async function signin(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const registerBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    });

    try {
        const { email, password } = registerBodySchema.parse(request.body);

        const signinUseCase = makeSignin();
        const user = await signinUseCase.handler(email);

        if (!user?.email) {
            throw new Error('User or password invalid');
        }

        if (!user.isVerified) {
            return reply.status(403).send('Usuário não verificado.');
        }

        const doesntPasswordMatch = await compare(password, user.password ?? "");

        if (!doesntPasswordMatch) {
            throw new Error('Invalid user or password');
        }

        // Gera o token de acesso (accessToken)
        const accessToken = await reply.jwtSign(
            { userId: user.id, email, role: user.role }
        );

        // Retorna o accessToken e informações do usuário
        return reply.status(200).send({
            token: accessToken,
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          });                              

    } catch (error) {
        const statusCode = error instanceof InvalidCredentialsError ? 401 : 500;
        if (error instanceof Error) {
            reply.status(statusCode).send({ error: error.message });
        } else {
            reply.status(statusCode).send({ error: 'Unknown error' });
        }
    }
}