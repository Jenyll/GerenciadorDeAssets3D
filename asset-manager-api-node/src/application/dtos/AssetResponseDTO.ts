import { AssetStatus } from "../../domain/enums/AssetStatus";

export interface AssetResponseDTO {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string | null;
  status: AssetStatus;
  fileSize: number;
  originalFileName: string;
  thumbnailPath: string | null;
  fileUrl: string;
  downloadUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
