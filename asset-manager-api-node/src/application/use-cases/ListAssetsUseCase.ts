import { AssetResponseDTO } from "../dtos/AssetResponseDTO";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class ListAssetsUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(search?: string): Promise<AssetResponseDTO[]> {
    const assets = await this.assetRepository.findAll(search);

    return assets.map(asset => ({
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
    }));
  }
}
