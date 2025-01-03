import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Terbit Travel API",
      version: "1.0.0",
      description: "Your API Description",
    },
    servers: [
      {
        url: "http://localhost:5000", // Sesuaikan dengan URL server Anda
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Mendefinisikan bahwa token adalah JWT
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Mendefinisikan bahwa seluruh API membutuhkan token
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Sesuaikan path file route kamu
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
