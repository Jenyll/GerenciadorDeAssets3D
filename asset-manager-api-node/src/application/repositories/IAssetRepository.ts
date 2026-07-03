import { Asset3D } from "../../domain/entities/Asset3D";
import { ExportedAssetFile } from "../../domain/entities/ExportedAssetFile";
import { CreateAssetDTO } from "../dtos/CreateAssetDTO";
import { UpdateAssetDTO } from "../dtos/UpdateAssetDTO";
import { CreateExportedAssetFileDTO } from "../dtos/CreateExportedAssetFileDTO";

export interface IAssetRepository {
  findAll(search?: string): Promise<Asset3D[]>;
  findById(id: string): Promise<Asset3D | null>;
  create(data: CreateAssetDTO): Promise<Asset3D>;
  update(id: string, data: UpdateAssetDTO): Promise<Asset3D | null>;
  delete(id: string): Promise<void>;

  createExportedFile(data: CreateExportedAssetFileDTO): Promise<ExportedAssetFile>;
  findExportsByAssetId(assetId: string): Promise<ExportedAssetFile[]>;
  findExportedFileById(assetId: string, exportId: string): Promise<ExportedAssetFile | null>;
  deleteExportedFile(assetId: string, exportId: string): Promise<void>;
}
