import { Router } from "express";
import { AssetsController } from "../controllers/AssetsController";
import { upload } from "../../infrastructure/upload/multerConfig";

const router = Router();
const controller = new AssetsController();

router.get("/", controller.getAll.bind(controller));
router.post("/", upload.single("file"), controller.create.bind(controller));

export default router;
