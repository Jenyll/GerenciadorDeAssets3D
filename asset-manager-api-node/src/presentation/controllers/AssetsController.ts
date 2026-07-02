import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { ListAssetsUseCase } from "../../application/use-cases/ListAssetsUseCase";
import { GetAssetByIdUseCase } from "../../application/use-cases/GetAssetByIdUseCase";
import { CreateAssetUseCase } from "../../application/use-cases/CreateAssetUseCase";
import { UpdateAssetUseCase } from "../../application/use-cases/UpdateAssetUseCase";
import { DeleteAssetUseCase } from "../../application/use-cases/DeleteAssetUseCase";
import { PrismaAssetRepository } from "../../infrastructure/repositories/PrismaAssetRepository";

export class AssetsController {

  async getAll(req: Request, res: Response) {
    try {
      const repository = new PrismaAssetRepository();
      const useCase = new ListAssetsUseCase(repository);

      const assets = await useCase.execute(
        req.query.search?.toString()
      );

      return res.json(assets);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao listar assets.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new GetAssetByIdUseCase(repository);

      const asset = await useCase.execute(id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      return res.json(asset);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar asset.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "O arquivo GLB é obrigatório."
        });
      }

      const repository = new PrismaAssetRepository();
      const useCase = new CreateAssetUseCase(repository);

      const asset = await useCase.execute({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags,
        originalFileName: req.file.originalname,
        storedFileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size
      });

      return res.status(201).json(asset);

    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao criar asset."
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new UpdateAssetUseCase(repository);

      const asset = await useCase.execute(id, {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags,
        status: req.body.status
      });

      if (!asset) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      return res.json(asset);

    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao atualizar asset."
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = req.params.id.toString();

      const repository = new PrismaAssetRepository();
      const useCase = new DeleteAssetUseCase(repository);

      const deleted = await useCase.execute(id);

      if (!deleted) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      return res.status(200).json({
        message: "Asset excluído com sucesso."
      });

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao excluir asset.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }

  async downloadOriginalFile(req: Request, res: Response) {
    try {
      const id = req.params.id.toString();

      const repository = new PrismaAssetRepository();
      const asset = await repository.findById(id);

      if (!asset) {
        return res.status(404).json({
          message: "Asset não encontrado."
        });
      }

      if (!asset.filePath || !fs.existsSync(asset.filePath)) {
        return res.status(404).json({
          message: "Arquivo original não encontrado."
        });
      }

      const absolutePath = path.resolve(asset.filePath);

      return res.download(absolutePath, asset.originalFileName);

    } catch (error) {
      return res.status(500).json({
        message: "Erro ao baixar arquivo original.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
  }
}
