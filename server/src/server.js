import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Explicitly load .env file from the parent 'server' directory.
// This is the most robust method and avoids issues with working directories.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in .env");
  process.exit(1);
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});