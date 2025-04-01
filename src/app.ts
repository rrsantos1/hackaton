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
import { contentRoutes } from "./modules/content/routes/routes";
import { supportRoutes } from "./modules/support/routes/routes";
import { notificationRoutes } from "./modules/notification/routes/routes";
import { activityRoutes } from "./modules/activity/routes/routes";

// Criação do servidor Fastify
export const app = fastify({
  bodyLimit: 20 * 1024 * 1024, // Limite de 20MB para requisições
  logger: env.NODE_ENV === 'production', // Log detalhado apenas em produção
});

// Configuração de CORS
app.register(fastifyCors, {
  origin: true,
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true,
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
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: { expiresIn: '2h' }, // Token válido por 2 horas
});

// Adiciona validação de autenticação
app.addHook('onRequest', validateJwt);

// Registra rotas
app.register(userRoutes);
app.register(contentRoutes);
app.register(supportRoutes);
app.register(notificationRoutes);
app.register(activityRoutes);

// Handler global de erros
app.setErrorHandler(globalErrorHandler);