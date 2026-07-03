export interface ExportAssetDTO {
  format: string;
  profile?: string;

  quality?: number;
  textureSize?: number;
  simplifyRatio?: number;
  dracoCompression?: boolean;

  rotation?: {
    x?: number;
    y?: number;
    z?: number;
  };

  scale?: number;

  camera?: {
    fieldOfView?: number;
    zoom?: number;
  };

  lighting?: {
    exposure?: number;
    intensity?: number;
    environment?: string;
  };
}
