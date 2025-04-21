import dotenv from "dotenv";

// Carregar arquivo .env baseado no NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
dotenv.config({ path: envFile });

import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3001),
    DATABASE_USER: z.string(),
    DATABASE_HOST: z.string(),
    DATABASE_NAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_PORT: z.coerce.number(),
    JWT_SECRET: z.string(),    
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    throw new Error("Invalid environment variables");
}

export const env = _env.data;