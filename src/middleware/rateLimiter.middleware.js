import rateLimit from "express-rate-limit";

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message:
    "Too many login attempts from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for exam attempts
export const examAttemptLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 hour || 2 minutes
  max: 3, // Limit each IP to 3 exam attempts per hour
  message:
    "Too many exam attempts from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
