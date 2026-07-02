import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import assetsRoutes from "./presentation/routes/assets.routes";
import { swaggerSpec } from "./infrastructure/swagger/swaggerConfig";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/storage", express.static(path.resolve("storage")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/assets", assetsRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Asset Manager API Node funcionando",
    swagger: "/api-docs",
    assets: "/api/assets"
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
