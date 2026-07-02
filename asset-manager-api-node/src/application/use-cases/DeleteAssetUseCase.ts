import fs from "fs";
import { IAssetRepository } from "../repositories/IAssetRepository";

export class DeleteAssetUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(id: string): Promise<boolean> {
    const asset = await this.assetRepository.findById(id);

    if (!asset) {
      return false;
    }

    await this.assetRepository.delete(id);

    if (asset.filePath && fs.existsSync(asset.filePath)) {
      fs.unlinkSync(asset.filePath);
    }

    return true;
  }
}
