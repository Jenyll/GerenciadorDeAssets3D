import { Request, Response } from "express";
import { PrismaAssetRepository } from "../../infrastructure/repositories/PrismaAssetRepository";
import { ListAssetsUseCase } from "../../application/use-cases/ListAssetsUseCase";
import { GetAssetByIdUseCase } from "../../application/use-cases/GetAssetByIdUseCase";
import { CreateAssetUseCase } from "../../application/use-cases/CreateAssetUseCase";

export class AssetsController {
  async getAll(req: Request, res: Response) {
    try {
      const search = req.query.search?.toString();

      const assetRepository = new PrismaAssetRepository();
      const useCase = new ListAssetsUseCase(assetRepository);

      const assets = await useCase.execute(search);

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
      const { id } = req.params;

      const assetRepository = new PrismaAssetRepository();
      const useCase = new GetAssetByIdUseCase(assetRepository);

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
      const assetRepository = new PrismaAssetRepository();
      const useCase = new CreateAssetUseCase(assetRepository);

      const asset = await useCase.execute(req.body);

      return res.status(201).json(asset);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao criar asset."
      });
    }
  }
}
