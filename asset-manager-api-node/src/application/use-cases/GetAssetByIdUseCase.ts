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
      originalFileName: asset.originalFileName,
      thumbnailPath: asset.thumbnailPath,
      fileUrl: `/${asset.filePath.replace(/\\/g, "/")}`,
      downloadUrl: `/api/assets/${asset.id}/download`,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt
    };
  }
}
