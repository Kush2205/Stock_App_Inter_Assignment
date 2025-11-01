import { config } from "dotenv";
import { resolve } from "path";

// Load .env from the backend directory (parent folder)
config({ path: resolve(__dirname, "../.env") });

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
};
