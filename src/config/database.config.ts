interface DatabaseConfig {
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_NAME: string | undefined;
}

export const databaseConfig: DatabaseConfig = {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  DB_NAME: process.env.DB_NAME,
};
