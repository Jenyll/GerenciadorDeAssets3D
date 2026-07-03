import path from "path";
import { ExportAssetDTO } from "../dtos/ExportAssetDTO";
import { ExportStatus } from "../../domain/enums/ExportStatus";
import { ExportedAssetFile } from "../../domain/entities/ExportedAssetFile";
import { IAssetRepository } from "../repositories/IAssetRepository";
import { AssetExporter } from "../../infrastructure/processing/AssetExporter";

export class CreateAssetExportUseCase {
  constructor(private readonly assetRepository: IAssetRepository) {}

  async execute(assetId: string, data: ExportAssetDTO): Promise<ExportedAssetFile | null> {
    const asset = await this.assetRepository.findById(assetId);

    if (!asset) {
      return null;
    }

    const format = data.format?.toLowerCase();

    if (!format) {
      throw new Error("O formato de exportação é obrigatório.");
    }

    const exporter = new AssetExporter();

    const outputDirectory = path.join("storage", "exports");
    const outputBaseName = `${asset.id}-${Date.now()}`;

    const exported = await exporter.export(
      asset.filePath,
      outputDirectory,
      outputBaseName,
      {
        format,
        profile: data.profile,
        quality: data.quality,
        dracoCompression: data.dracoCompression
      }
    );

    return this.assetRepository.createExportedFile({
      assetId: asset.id,
      format,
      profile: data.profile ?? "web-optimized",
      optionsJson: JSON.stringify(data),
      fileName: exported.fileName,
      filePath: exported.filePath,
      fileSize: exported.fileSize,
      status: ExportStatus.COMPLETED
    });
  }
}
