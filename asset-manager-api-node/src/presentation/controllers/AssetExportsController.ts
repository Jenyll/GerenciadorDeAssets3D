import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { PrismaAssetRepository } from "../../infrastructure/repositories/PrismaAssetRepository";
import { CreateAssetExportUseCase } from "../../application/use-cases/CreateAssetExportUseCase";
import { ListAssetExportsUseCase } from "../../application/use-cases/ListAssetExportsUseCase";
import { GetAssetExportByIdUseCase } from "../../application/use-cases/GetAssetExportByIdUseCase";
import { DeleteAssetExportUseCase } from "../../application/use-cases/DeleteAssetExportUseCase";

export class AssetExportsController {
  async create(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new CreateAssetExportUseCase(repository);

      const exportedFile = await useCase.execute(assetId, req.body);

      if (!exportedFile) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      return res.status(201).json({
        id: exportedFile.id,
        assetId: exportedFile.assetId,
        format: exportedFile.format,
        profile: exportedFile.profile,
        fileName: exportedFile.fileName,
        fileSize: exportedFile.fileSize,
        status: exportedFile.status,
        createdAt: exportedFile.createdAt,
        downloadUrl: `/api/assets/${assetId}/exports/${exportedFile.id}/download`
      });

    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao exportar asset.";

      if (message.includes("pipeline externo")) {
        return res.status(501).json({ message });
      }

      return res.status(400).json({ message });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new ListAssetExportsUseCase(repository);

      const exportedFiles = await useCase.execute(assetId);

      if (!exportedFiles) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      return res.json(exportedFiles);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar exportações.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId.toString();
      const exportId = req.params.exportId.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new GetAssetExportByIdUseCase(repository);

      const exportedFile = await useCase.execute(assetId, exportId);

      if (!exportedFile) {
        return res.status(404).json({
          message: "Arquivo exportado não encontrado."
        });
      }

      return res.json(exportedFile);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar exportação.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async download(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId.toString();
      const exportId = req.params.exportId.toString();

      const repository = new PrismaAssetRepository();
      const exportedFile = await repository.findExportedFileById(assetId, exportId);

      if (!exportedFile) {
        return res.status(404).json({
          message: "Arquivo exportado não encontrado."
        });
      }

      if (!fs.existsSync(exportedFile.filePath)) {
        return res.status(404).json({
          message: "Arquivo exportado não encontrado no servidor."
        });
      }

      const absolutePath = path.resolve(exportedFile.filePath);

      return res.download(absolutePath, exportedFile.fileName);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao baixar arquivo exportado.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const assetId = req.params.assetId.toString();
      const exportId = req.params.exportId.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new DeleteAssetExportUseCase(repository);

      const deleted = await useCase.execute(assetId, exportId);

      if (!deleted) {
        return res.status(404).json({
          message: "Arquivo exportado não encontrado."
        });
      }

      return res.status(200).json({
        message: "Arquivo exportado excluído com sucesso."
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao excluir arquivo exportado.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }
}
