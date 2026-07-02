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
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const repository = new PrismaAssetRepository();
      const useCase = new CreateAssetUseCase(repository);

      const asset = await useCase.execute(req.body);

      return res.status(201).json(asset);

    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
