import { Router } from "express";
import { AssetsController } from "../controllers/AssetsController";

const router = Router();
const controller = new AssetsController();

router.get("/", controller.getAll.bind(controller));
router.post("/", controller.create.bind(controller));

export default router;
