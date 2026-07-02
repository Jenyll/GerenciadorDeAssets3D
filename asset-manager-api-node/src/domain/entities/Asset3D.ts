import { AssetStatus } from "../enums/AssetStatus";
import { ExportedAssetFile } from "./ExportedAssetFile";

export class Asset3D {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string | null,
    public category: string | null,
    public tags: string | null,

    public originalFileName: string,
    public storedFileName: string,
    public filePath: string,
    public thumbnailPath: string | null,

    public fileSize: number,

    public vertexCount: number | null,
    public triangleCount: number | null,
    public meshCount: number | null,
    public materialCount: number | null,
    public animationCount: number | null,

    public width: number | null,
    public height: number | null,
    public depth: number | null,

    public status: AssetStatus,

    public readonly createdAt: Date,
    public updatedAt: Date,

    public exportedFiles: ExportedAssetFile[] = []
  ) {}
}
