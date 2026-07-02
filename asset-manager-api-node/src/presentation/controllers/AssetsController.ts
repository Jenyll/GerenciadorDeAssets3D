import { Request, Response } from "express";
import { ListAssetsUseCase } from "../../application/use-cases/ListAssetsUseCase";
import { CreateAssetUseCase } from "../../application/use-cases/CreateAssetUseCase";
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
}
