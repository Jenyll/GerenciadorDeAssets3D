import { AssetStatus } from "../../domain/enums/AssetStatus";
import { AssetResponseDTO } from "../dtos/AssetResponseDTO";
import { UpdateAssetDTO } from "../dtos/UpdateAssetDTO";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class UpdateAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(id: string, data: UpdateAssetDTO): Promise<AssetResponseDTO | null> {
    if (!data.name || !data.name.trim()) {
      throw new Error("O nome do asset é obrigatório.");
    }

    const allowedStatuses = Object.values(AssetStatus);

    if (!allowedStatuses.includes(data.status)) {
      throw new Error("Status inválido.");
    }

    const asset = await this.assetRepository.update(id, {
      name: data.name.trim(),
      description: data.description,
      category: data.category,
      tags: data.tags,
      status: data.status
    });

    if (!asset) {
      return null;
    }

    return {
      id: asset.id,
      name: asset.name,
      description: asset.description,
      category: asset.category,
      tags: asset.tags,
      status: asset.status,
      fileSize: asset.fileSize,
      thumbnailPath: asset.thumbnailPath,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    };
  }
}
