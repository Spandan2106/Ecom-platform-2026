import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import adminRoutes from "./routes/admin.routes.js";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import paymentRoutes from "./routes/payment.routes.js";
import userRoutes from "./routes/userRoutes.js";



const app = express();

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(cors({
  origin: [process.env.CLIENT_URL, "https://ecom-platform-2026-git-main-spandan-das-s-projects.vercel.app", "https://ecom-platform-2026.vercel.app"],
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", apiLimiter);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running successfully");
});

app.use(errorMiddleware);

export default app;
