import { env } from '../../env'
import { FastifyReply, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

interface ErrorHandlerMap {
  [key: string]: (
    error: Error | ZodError,
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void> | void // Permite funções síncronas ou assíncronas
}

export const errorHandlerMap: ErrorHandlerMap = {
  ZodError: async (error, _, reply) => {
    await reply.status(400).send({
      message: 'Validation error',
      ...(error instanceof ZodError && { error: error.format() }),
    })
  },
  ResourceNotFoundError: async (error, __, reply) => {
    await reply.status(404).send({ message: error.message })
  },
  InvalidCredentialsError: async (error, __, reply) => {
    await reply.status(404).send({ message: error.message })
  },
}

export const globalErrorHandler = async (
  error: Error,
  _: FastifyRequest,
  reply: FastifyReply,
) => {
  if (env.NODE_ENV === 'development') {
    console.error(error)
  }

  const handler = errorHandlerMap[error.constructor.name]

  if (handler) {
    return handler(error, _, reply) // Handler já suporta Promise<void> ou void
  }

  await reply.status(500).send({ message: 'Internal server error' })
}