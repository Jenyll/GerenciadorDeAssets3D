import fs from "fs";
import path from "path";

const gltfPipeline = require("gltf-pipeline");

type ExportOptions = {
  format: string;
  profile?: string;
  quality?: number;
  dracoCompression?: boolean;
};

export class AssetExporter {
  async export(
    inputFilePath: string,
    outputDirectory: string,
    outputBaseName: string,
    options: ExportOptions
  ): Promise<{ fileName: string; filePath: string; fileSize: number }> {
    if (!fs.existsSync(inputFilePath)) {
      throw new Error("Arquivo GLB original não encontrado.");
    }

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const format = options.format.toLowerCase();
    const profile = options.profile?.toLowerCase() || "web-optimized";

    if (format === "gltf") {
      return this.exportToGltf(inputFilePath, outputDirectory, outputBaseName);
    }

    if (format === "glb" || format === "optimized-glb") {
      return this.exportToGlb(inputFilePath, outputDirectory, outputBaseName, {
        profile,
        quality: options.quality,
        dracoCompression: options.dracoCompression
      });
    }

    if (["fbx", "usd", "usda", "usdc", "datasmith"].includes(format)) {
      throw new Error(
        `Formato ${format} previsto na arquitetura, mas exige pipeline externo como Blender, OpenUSD ou Datasmith.`
      );
    }

    throw new Error("Formato de exportação não suportado.");
  }

  private async exportToGltf(
    inputFilePath: string,
    outputDirectory: string,
    outputBaseName: string
  ): Promise<{ fileName: string; filePath: string; fileSize: number }> {
    const glb = fs.readFileSync(inputFilePath);

    const result = await gltfPipeline.glbToGltf(glb, {
      separate: false
    });

    const fileName = `${outputBaseName}.gltf`;
    const filePath = path.join(outputDirectory, fileName);

    fs.writeFileSync(filePath, JSON.stringify(result.gltf, null, 2));

    const stats = fs.statSync(filePath);

    return {
      fileName,
      filePath,
      fileSize: stats.size
    };
  }

  private async exportToGlb(
    inputFilePath: string,
    outputDirectory: string,
    outputBaseName: string,
    options: {
      profile?: string;
      quality?: number;
      dracoCompression?: boolean;
    }
  ): Promise<{ fileName: string; filePath: string; fileSize: number }> {
    const glb = fs.readFileSync(inputFilePath);

    const shouldOptimize =
      options.profile === "web-optimized" ||
      options.dracoCompression === true;

    let outputGlb = glb;

    if (shouldOptimize) {
      const quality = options.quality ?? 80;

      const compressionLevel =
        quality >= 90 ? 3 :
        quality >= 70 ? 6 :
        8;

      const result = await gltfPipeline.processGlb(glb, {
        dracoOptions: {
          compressionLevel
        }
      });

      outputGlb = result.glb;
    }

    const fileName = `${outputBaseName}.glb`;
    const filePath = path.join(outputDirectory, fileName);

    fs.writeFileSync(filePath, outputGlb);

    const stats = fs.statSync(filePath);

    return {
      fileName,
      filePath,
      fileSize: stats.size
    };
  }
}
