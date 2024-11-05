import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/library",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      MONGODB_URI: string;
      NODE_ENV: "development" | "production" | "test";
      JWT_SECRET: string;
    }
  }
}
