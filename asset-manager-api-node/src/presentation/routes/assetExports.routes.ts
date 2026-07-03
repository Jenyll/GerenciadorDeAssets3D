import { Router } from "express";
import { AssetExportsController } from "../controllers/AssetExportsController";

const router = Router();
const controller = new AssetExportsController();

router.post("/:assetId/exports", controller.create.bind(controller));
router.get("/:assetId/exports", controller.getAll.bind(controller));
router.get("/:assetId/exports/:exportId/download", controller.download.bind(controller));
router.get("/:assetId/exports/:exportId", controller.getById.bind(controller));
router.delete("/:assetId/exports/:exportId", controller.delete.bind(controller));

export default router;
