import ApiError from "./utils/error/ApiError.js";
import authRouter from "./modules/auth/auth.router.js";
import studentRouter from "./modules/students/student.router.js";
import questionRouter from "./modules/question/question.router.js";
import examRouter from "./modules/exam/exam.router.js";
import attemptRouter from "./modules/attempt/attempt.router.js";
import morgan from "morgan";
import cors from "cors";
import compression from "compression";
import errorHandler from "./middleware/errorhandler.middleware.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./docs/config/swagger.js";
import {
  apiLimiter,
  authLimiter,
  examAttemptLimiter,
} from "./middleware/rateLimiter.middleware.js";

export const appRouter = (app, express) => {
  // Global Middleware
  app.use(express.json());
  // FE_URL
  app.use(
    cors(
      process.env.NODE_ENV === "dev"
        ? { origin: "*" } // Allow all origins in development
        : {
            origin: process.env.FE_URL, // Use the configured frontend URL in production
            credentials: true, // Allow credentials if needed
          }
    )
  );
  
  app.use(compression());
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan(":method :url :response-time ms"));
  }

  // Apply rate limiting to all routes
  app.use(apiLimiter);

  // Swagger UI setup
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Exam System API Documentation",
    })
  );

  // Routes
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to the Exam Management System API",
      version: "1.0.0",
    });
  });

  // Auth routes with stricter rate limiting
  app.use("/api/v1/auth", authLimiter, authRouter);

  // Student routes
  app.use("/api/v1/student", studentRouter);

  // Exam routes
  app.use("/api/v1/exam", examRouter);

  // Question routes
  app.use("/api/v1/question", questionRouter);

  // Attempt routes with exam attempt rate limiting
  const prefixes = ["/api/v1/student/exams", "/api/v1/admin/exams"];
  prefixes.forEach((prefix) => {
    app.use(prefix, attemptRouter);
  });

  // not found page router
  app.all("/{*any}", (req, res, next) => {
    return next(new ApiError(404, "Page not found"));
  });

  // Global error handler
  app.use(errorHandler);
};
