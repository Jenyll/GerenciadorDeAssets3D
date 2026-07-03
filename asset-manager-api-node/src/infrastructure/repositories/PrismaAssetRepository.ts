import { Asset3D } from "../../domain/entities/Asset3D";
import { ExportedAssetFile } from "../../domain/entities/ExportedAssetFile";
import { AssetStatus } from "../../domain/enums/AssetStatus";
import { ExportStatus } from "../../domain/enums/ExportStatus";
import { IAssetRepository } from "../../application/repositories/IAssetRepository";
import { CreateAssetDTO } from "../../application/dtos/CreateAssetDTO";
import { UpdateAssetDTO } from "../../application/dtos/UpdateAssetDTO";
import { CreateExportedAssetFileDTO } from "../../application/dtos/CreateExportedAssetFileDTO";
import { prisma } from "../database/prismaClient";

type PrismaAsset = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string | null;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  thumbnailPath: string | null;
  fileSize: number;
  vertexCount: number | null;
  triangleCount: number | null;
  meshCount: number | null;
  materialCount: number | null;
  animationCount: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaExportedFile = {
  id: string;
  assetId: string;
  format: string;
  profile: string | null;
  optionsJson: string | null;
  fileName: string;
  filePath: string;
  fileSize: number;
  status: string;
  createdAt: Date;
};

export class PrismaAssetRepository implements IAssetRepository {
  async findAll(search?: string): Promise<Asset3D[]> {
    const assets = await prisma.asset3D.findMany({
      where: search
        ? {
            name: {
              contains: search
            }
          }
        : undefined,
      orderBy: {
        createdAt: "desc"
      }
    });

    return assets.map(asset => this.toDomain(asset));
  }

  async findById(id: string): Promise<Asset3D | null> {
    const asset = await prisma.asset3D.findUnique({
      where: { id }
    });

    if (!asset) {
      return null;
    }

    return this.toDomain(asset);
  }

  async create(data: CreateAssetDTO): Promise<Asset3D> {
    const asset = await prisma.asset3D.create({
      data: {
        name: data.name.trim(),
        description: data.description ?? null,
        category: data.category ?? null,
        tags: data.tags ?? null,
        originalFileName: data.originalFileName,
        storedFileName: data.storedFileName,
        filePath: data.filePath,
        thumbnailPath: null,
        fileSize: data.fileSize,
        vertexCount: null,
        triangleCount: null,
        meshCount: null,
        materialCount: null,
        animationCount: null,
        width: null,
        height: null,
        depth: null,
        status: "AVAILABLE"
      }
    });

    return this.toDomain(asset);
  }

  async update(id: string, data: UpdateAssetDTO): Promise<Asset3D | null> {
    const existingAsset = await prisma.asset3D.findUnique({
      where: { id }
    });

    if (!existingAsset) {
      return null;
    }

    const asset = await prisma.asset3D.update({
      where: { id },
      data: {
        name: data.name.trim(),
        description: data.description ?? null,
        category: data.category ?? null,
        tags: data.tags ?? null,
        status: data.status
      }
    });

    return this.toDomain(asset);
  }

  async delete(id: string): Promise<void> {
    await prisma.asset3D.delete({
      where: { id }
    });
  }

  async createExportedFile(data: CreateExportedAssetFileDTO): Promise<ExportedAssetFile> {
    const exportedFile = await prisma.exportedAssetFile.create({
      data: {
        assetId: data.assetId,
        format: data.format,
        profile: data.profile ?? null,
        optionsJson: data.optionsJson ?? null,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        status: data.status
      }
    });

    return this.toExportedDomain(exportedFile);
  }

  async findExportsByAssetId(assetId: string): Promise<ExportedAssetFile[]> {
    const exportedFiles = await prisma.exportedAssetFile.findMany({
      where: { assetId },
      orderBy: {
        createdAt: "desc"
      }
    });

    return exportedFiles.map(file => this.toExportedDomain(file));
  }

  async findExportedFileById(assetId: string, exportId: string): Promise<ExportedAssetFile | null> {
    const exportedFile = await prisma.exportedAssetFile.findFirst({
      where: {
        id: exportId,
        assetId
      }
    });

    if (!exportedFile) {
      return null;
    }

    return this.toExportedDomain(exportedFile);
  }

  async deleteExportedFile(assetId: string, exportId: string): Promise<void> {
    await prisma.exportedAssetFile.deleteMany({
      where: {
        id: exportId,
        assetId
      }
    });
  }

  private toDomain(asset: PrismaAsset): Asset3D {
    return new Asset3D(
      asset.id,
      asset.name,
      asset.description,
      asset.category,
      asset.tags,
      asset.originalFileName,
      asset.storedFileName,
      asset.filePath,
      asset.thumbnailPath,
      asset.fileSize,
      asset.vertexCount,
      asset.triangleCount,
      asset.meshCount,
      asset.materialCount,
      asset.animationCount,
      asset.width,
      asset.height,
      asset.depth,
      asset.status as AssetStatus,
      asset.createdAt,
      asset.updatedAt
    );
  }

  private toExportedDomain(exportedFile: PrismaExportedFile): ExportedAssetFile {
    return new ExportedAssetFile(
      exportedFile.id,
      exportedFile.assetId,
      exportedFile.format,
      exportedFile.fileName,
      exportedFile.filePath,
      exportedFile.fileSize,
      exportedFile.status as ExportStatus,
      exportedFile.createdAt,
      exportedFile.profile,
      exportedFile.optionsJson
    );
  }
}
