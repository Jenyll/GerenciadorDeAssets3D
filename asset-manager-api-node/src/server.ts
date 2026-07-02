import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import assetsRoutes from "./presentation/routes/assets.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/storage", express.static(path.resolve("storage")));
app.use("/api/assets", assetsRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "Asset Manager API Node funcionando",
    docs: "/api/assets"
  });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
