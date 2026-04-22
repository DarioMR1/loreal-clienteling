import { Provider } from "@nestjs/common";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@loreal/database";

export const DATABASE_TOKEN = "DATABASE";

export const databaseProvider: Provider = {
  provide: DATABASE_TOKEN,
  useFactory: () => {
    const pool = new Pool({
      connectionString:
        process.env.DATABASE_URL ??
        "postgresql://loreal:loreal@localhost:5433/loreal_clienteling",
    });

    return drizzle(pool, { schema });
  },
};

export type Database = ReturnType<typeof drizzle<typeof schema>>;
