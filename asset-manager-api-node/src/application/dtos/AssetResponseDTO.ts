import { AssetStatus } from "../../domain/enums/AssetStatus";

export interface AssetResponseDTO {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string | null;
  status: AssetStatus;
  fileSize: number;
  thumbnailPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}
