import { ExportedAssetFile } from "../../domain/entities/ExportedAssetFile";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class GetAssetExportByIdUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(assetId: string, exportId: string): Promise<ExportedAssetFile | null> {
    return this.assetRepository.findExportedFileById(assetId, exportId);
  }
}
