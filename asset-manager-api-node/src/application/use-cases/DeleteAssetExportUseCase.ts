import fs from "fs";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class DeleteAssetExportUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(assetId: string, exportId: string): Promise<boolean> {
    const exportedFile = await this.assetRepository.findExportedFileById(assetId, exportId);

    if (!exportedFile) {
      return false;
    }

    await this.assetRepository.deleteExportedFile(assetId, exportId);

    if (exportedFile.filePath && fs.existsSync(exportedFile.filePath)) {
      fs.unlinkSync(exportedFile.filePath);
    }

    return true;
  }
}
