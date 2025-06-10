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

export const appRouter = (app, express) => {
  // Global Middleware
  app.use(express.json());
  app.use(cors());
  app.use(compression());
  if (process.env.NODE_ENV == "dev") {
    app.use(morgan(":method :url :response-time ms"));
  }

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
  // Auth
  app.use("/api/v1/auth", authRouter);

  // Student
  app.use("/api/v1/student", studentRouter);

  // Question
  app.use("/api/v1/exam", examRouter);

  // Question
  app.use("/api/v1/question", questionRouter);

  // Attempt
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
