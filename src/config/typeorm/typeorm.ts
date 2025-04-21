import { DataSource } from "typeorm";
import { env } from "../../env";
import { User } from "../../modules/auth/entities/User";
import { Activity } from "../../modules/activity/entities/Activity";
import { databaseInitialQuery } from "../init";

export const appDataSource = new DataSource({
    type: 'postgres',
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    entities: [
        User, Activity
    ],
    synchronize: env.NODE_ENV === 'development', // Apenas sincronizar em dev
    logging: env.NODE_ENV === 'development', // Logs em dev
    migrations: [],
});

appDataSource.initialize()
    .then(async () => {
        console.log('Database connected');
        console.log('Skipping migrations, relying on existing database structure.');

        const connection = appDataSource.manager;

        try {
            await connection.query(databaseInitialQuery);
        } catch (error) {
            console.error('Error executing query:', error);
        }
    })
    .catch((error) => {
        console.error('Error connecting to database with TypeORM:', error);
    });