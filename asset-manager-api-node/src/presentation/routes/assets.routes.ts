import { Router } from "express";
import { AssetsController } from "../controllers/AssetsController";
import { upload } from "../../infrastructure/upload/multerConfig";

const router = Router();
const controller = new AssetsController();

router.get("/", controller.getAll.bind(controller));
router.get("/:id/download", controller.downloadOriginalFile.bind(controller));
router.get("/:id", controller.getById.bind(controller));
router.post("/", upload.single("file"), controller.create.bind(controller));
router.put("/:id", controller.update.bind(controller));
router.delete("/:id", controller.delete.bind(controller));

export default router;
