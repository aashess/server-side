import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_fNZB3gpJ4ErD@ep-polished-violet-ad4oeuyv-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    console.log("✅ Connected to Neon!");

    // Create table query
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log("🛠️ Users table created successfully!");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();