const dbConfig = {
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "Danny12345",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  name: process.env.DB_NAME || "maternal_care_db",
};

export const DATABASE_URL =
  `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}` ||
  "postgresql://postgres:Danny12345@localhost:5432/maternal_care_db";

/**
 * PostgreSQL connection string format:
 * postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]
 * Example:
 * postgresql://postgres:Danny12345@localhost:5432/maternal_care_db
 * mysql example:
 * mysql://user:password@host:port/database
 */
