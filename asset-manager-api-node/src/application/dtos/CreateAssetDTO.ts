export interface CreateAssetDTO {
  name: string;
  description?: string;
  category?: string;
  tags?: string;

  originalFileName: string;
  storedFileName: string;
  filePath: string;
  fileSize: number;
}
