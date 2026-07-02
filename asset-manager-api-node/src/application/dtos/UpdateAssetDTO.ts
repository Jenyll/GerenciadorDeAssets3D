import { AssetStatus } from "../../domain/enums/AssetStatus";

export interface UpdateAssetDTO {
  name: string;
  description?: string;
  category?: string;
  tags?: string;
  status: AssetStatus;
}
