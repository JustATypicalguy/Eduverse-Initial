// Path: server/src/db/index.ts

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
// Path from server/src/db/ to shared/schema.ts is up 3 levels
import * as schema from "../../../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "FATAL ERROR: DATABASE_URL is not set in your .env file."
  );
}

// NOTE: Your team might be using Drizzle with a different driver (like 'pg' for local setup). 
// This code assumes you are using Neon/serverless environment. If not, change the first two imports.
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });