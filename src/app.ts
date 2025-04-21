import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { env } from './env';
import fastifyStatic from "@fastify/static";
import path from "path";
import { validateJwt } from "./config/jwt-validate";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import fastifyCookie from '@fastify/cookie';
import { userRoutes } from "./modules/auth/routes/routes";
import { globalErrorHandler } from "./shared/errors/global-error-handler";
import { activityRoutes } from "./modules/activity/routes/routes";

// Criação do servidor Fastify
export const app = fastify({
  bodyLimit: 20 * 1024 * 1024,
  logger: env.NODE_ENV === 'production',
});

app.register(fastifyCors, {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

app.register(fastifyStatic, {
  root: path.join(__dirname, "/uploads"),
  prefix: "/uploads", 
});

app.register(fastifyMultipart);

// Configuração de cookies
app.register(fastifyCookie);

// Configuração do JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,  
  sign: { expiresIn: '2h' }, // Token válido por 2 horas
});

// Adiciona validação de autenticação
app.addHook('onRequest', validateJwt);

// Registra rotas
app.register(userRoutes);
app.register(activityRoutes);

// Handler global de erros
app.setErrorHandler(globalErrorHandler);