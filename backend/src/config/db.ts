import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Danny12345",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  name: process.env.DB_NAME || "maternal_care_db",
};

// This ensures your app always uses the individual variables to build the URL
export const DATABASE_URL = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
