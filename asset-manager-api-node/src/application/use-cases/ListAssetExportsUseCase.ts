import { ExportedAssetFile } from "../../domain/entities/ExportedAssetFile";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class ListAssetExportsUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(assetId: string): Promise<ExportedAssetFile[] | null> {
    const asset = await this.assetRepository.findById(assetId);

    if (!asset) {
      return null;
    }

    return this.assetRepository.findExportsByAssetId(assetId);
  }
}
