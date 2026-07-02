-- CreateTable
CREATE TABLE "Asset3D" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT,
    "originalFileName" TEXT NOT NULL,
    "storedFileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "fileSize" INTEGER NOT NULL,
    "vertexCount" INTEGER,
    "triangleCount" INTEGER,
    "meshCount" INTEGER,
    "materialCount" INTEGER,
    "animationCount" INTEGER,
    "width" REAL,
    "height" REAL,
    "depth" REAL,
    "status" TEXT NOT NULL DEFAULT 'PROCESSING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ExportedAssetFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "assetId" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ExportedAssetFile_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset3D" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
