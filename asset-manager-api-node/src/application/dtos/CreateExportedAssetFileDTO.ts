import { ExportStatus } from "../../domain/enums/ExportStatus";

export interface CreateExportedAssetFileDTO {
  assetId: string;
  format: string;
  profile?: string;
  optionsJson?: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  status: ExportStatus;
}
