import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";
dotenv.config();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exam System API Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for the Exam Management System",
      contact: {
        name: "API Support",
        email: "support@examsystem.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
      {
        url: process.env.PRODUCTION_URL,
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1,
            },
            limit: {
              type: "integer",
              example: 10,
            },
            totalPages: {
              type: "integer",
              example: 5,
            },
            totalResults: {
              type: "integer",
              example: 50,
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [ "./src/docs/features/**/*.js"],
};

export const specs = swaggerJsdoc(options);
