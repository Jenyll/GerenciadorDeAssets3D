import { Asset3D } from "../../domain/entities/Asset3D";
import { CreateAssetDTO } from "../dtos/CreateAssetDTO";
import { UpdateAssetDTO } from "../dtos/UpdateAssetDTO";

export interface IAssetRepository {
  findAll(search?: string): Promise<Asset3D[]>;
  findById(id: string): Promise<Asset3D | null>;
  create(data: CreateAssetDTO): Promise<Asset3D>;
  update(id: string, data: UpdateAssetDTO): Promise<Asset3D | null>;
  delete(id: string): Promise<void>;
}
