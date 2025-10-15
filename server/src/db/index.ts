import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// This is required for serverless environments
neonConfig.webSocketConstructor = ws;

// Check if the database URL is provided in the environment variables
if (!process.env.DATABASE_URL) {
  throw new Error(
    "FATAL ERROR: DATABASE_URL is not set in your .env file."
  );
}

// Create a new database connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the Drizzle instance that we'll use throughout our app
export const db = drizzle({ client: pool, schema });