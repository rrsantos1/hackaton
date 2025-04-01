import { env } from './env';
import { app } from './app';

const startServer = async () => {
  try {
    // Define o baseUrl com o domínio de produção ou localhost para dev
    const baseUrl =
      env.NODE_ENV === 'production'
        ? 'https://timetolearn.com' // Substitua pelo domínio correto
        : `http://localhost:${env.PORT}`;
    
    // Escuta em '0.0.0.0' para produção e localhost para desenvolvimento
    await app.listen({
      host: '0.0.0.0', // Padrão para servidores na nuvem
      port: env.PORT,
    });

    console.log(`Servidor iniciado em: ${baseUrl}`);
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

startServer();