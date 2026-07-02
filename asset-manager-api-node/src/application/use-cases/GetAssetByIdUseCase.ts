import { AssetResponseDTO } from "../dtos/AssetResponseDTO";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class GetAssetByIdUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(id: string): Promise<AssetResponseDTO | null> {
    const asset = await this.assetRepository.findById(id);

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
