import { ExportStatus } from "../enums/ExportStatus";

export class ExportedAssetFile {
  constructor(
    public readonly id: string,
    public readonly assetId: string,
    public format: string,
    public fileName: string,
    public filePath: string,
    public fileSize: number,
    public status: ExportStatus,
    public readonly createdAt: Date
  ) {}
}
