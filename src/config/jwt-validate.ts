import fastifyConstructor, { FastifyReply, FastifyRequest } from "fastify";

const fastify = fastifyConstructor();

const ROUTE_FREE_PATTERNS = [
  /^POST-\/user$/,
  /^POST-\/user\/signin$/,
  /^GET-\/public(\/.*)?$/,
  /^GET-\/uploads(\/.*)?$/, // <-- Libera arquivos estáticos
];

/**
 * Obtém o identificador da rota no formato METHOD-PATH.
 */
function getRouteIdentifier(request: FastifyRequest): string {
  const method = request.method;
  const path = request.url.split('?')[0]; // Remove query params para a rota base
  return `${method}-${path}`;
}

/**
 * Verifica se a rota está na lista de rotas livres.
 */
function isRouteFree(request: FastifyRequest): boolean {
  const route = getRouteIdentifier(request);
  return ROUTE_FREE_PATTERNS.some((pattern) => pattern.test(route));
}

/**
 * Middleware de validação de JWT.
 */
export async function validateJwt(request: FastifyRequest, reply: FastifyReply): Promise<void> {  
  try {
    if (isRouteFree(request)) {
      return; // Rota liberada, não exige autenticação
    }    

    // Verifica o JWT
    await request.jwtVerify();

    const { userId, role } = request.user as { userId: string; role: string };
    request.user = {
      ...(typeof request.user === 'object' && request.user !== null ? request.user : {}),
      user_id: userId,
    };

    // Verifica se a rota de admin está permitida
    if (!isAdminAccessAllowed(role, request)) {
      return reply.status(403).send({ message: 'Access denied' });
    }
  } catch (error) {
    if ((error as Error).message === 'Authorization token expired') {
      return reply.status(401).send({ message: 'Token expired' });
    } else {
      return reply.status(401).send({ message: 'Unauthorized' });
    }
  }
}

/**
 * Verifica permissões de acesso às rotas de admin.
 */
function isAdminAccessAllowed(role: string, request: FastifyRequest): boolean {
  const route = getRouteIdentifier(request);
  const ADMIN_ROUTE_PATTERNS = [
    /^GET-\/admin/,
    /^POST-\/admin/,
    /^PUT-\/admin/,
    /^DELETE-\/admin/,
  ];
  return !ADMIN_ROUTE_PATTERNS.some((pattern) => pattern.test(route)) || role === 'admin';
}