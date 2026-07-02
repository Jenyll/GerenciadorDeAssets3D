import { Asset3D } from "../../domain/entities/Asset3D";
import { CreateAssetDTO } from "../dtos/CreateAssetDTO";

export interface IAssetRepository {
  findAll(search?: string): Promise<Asset3D[]>;
  create(data: CreateAssetDTO): Promise<Asset3D>;
}
