import { defineConfig } from "drizzle-kit";

// ✅ Friendly error if missing .env value
if (!process.env.DATABASE_URL) {
  throw new Error("❌ Missing DATABASE_URL. Please add it to your .env file before running migrations.");
}

export default defineConfig({
  schema: "./shared/schema.ts",     
  out: "./drizzle",                 
  dialect: "postgresql",            
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
  verbose: true,                    
  strict: true,                     
});
