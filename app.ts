import dotenv from "dotenv";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger/swagger";
import bookRoutes from "./routes/bookRoutes";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Pengaturan session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Koneksi ke MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "5000", {})
  .then(() => console.log("Database connected"))
  .catch((err: any) => console.error("Database connection error:", err));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use("/api", bookRoutes);

// Jalankan server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
