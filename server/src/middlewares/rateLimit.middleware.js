import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 10 * 1000, // 1 minutes
  max: 10000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
