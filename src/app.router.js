import ApiError from "./utils/error/ApiError.js";
import authRouter from "./modules/auth/auth.router.js";
import morgan from "morgan";
import sendResponse from "./utils/response.js";

export const appRouter = (app, express) => {
  // Global Middleware
  app.use(express.json());
  app.use(morgan(":method :url :response-time ms"));

  // Routes
  // Auth
  app.use("/api/auth", authRouter);

  // not found page router
  app.all("/{*any}", (req, res, next) => {
    return next(new ApiError(404, "Page not found"));
  });

  // Global error handler
  app.use((error, req, res, next) => {
    const isDev = process.env.ENV === "dev";
    return sendResponse(res, {
      statusCode: error.statusCode || 500,
      success: false,
      message: error.message || "Internal server error",
      ...(isDev && { stack: error.stack }),
    });
  });
};
