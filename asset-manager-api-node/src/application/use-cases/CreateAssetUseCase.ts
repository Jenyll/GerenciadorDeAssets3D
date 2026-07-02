import { CreateAssetDTO } from "../dtos/CreateAssetDTO";
import { AssetResponseDTO } from "../dtos/AssetResponseDTO";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class CreateAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(data: CreateAssetDTO): Promise<AssetResponseDTO> {
    if (!data.name || !data.name.trim()) {
      throw new Error("O nome do asset é obrigatório.");
    }

    const asset = await this.assetRepository.create({
      name: data.name.trim(),
      description: data.description,
      category: data.category,
      tags: data.tags
    });

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
