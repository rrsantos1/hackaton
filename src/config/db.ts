import { Pool, PoolClient } from 'pg';
import { env } from '../env';

// Determina o host com base no ambiente
const host =
  env.DATABASE_HOST?.trim() || (env.NODE_ENV === 'development' ? 'localhost' : 'db');

// Configurações do banco de dados
const CONFIG = {
  user: env.DATABASE_USER,
  host, // Host ajustado dinamicamente
  database: env.DATABASE_NAME,
  password: env.DATABASE_PASSWORD,
  port: env.DATABASE_PORT,
};

class Database {
  private readonly pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool(CONFIG);
  }

  /**
   * Inicializa a conexão com o banco de dados.
   */
  public async initialize(): Promise<void> {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      throw new Error(`Error connecting to database: ${error}`);
    }
  }

  /**
   * Retorna a instância do cliente conectado ao banco.
   */
  get clientInstance(): PoolClient | undefined {
    return this.client;
  }

  /**
   * Finaliza a conexão com o banco de dados.
   */
  public async close(): Promise<void> {
    try {
      await this.client?.release();
      await this.pool.end();
    } catch (error) {
      throw new Error(`Error closing database connection: ${error}`);
    }
  }
}

// Instância única do banco de dados
export const database = new Database();