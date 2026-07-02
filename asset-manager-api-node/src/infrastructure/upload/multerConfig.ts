import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDirectory = "storage/assets";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },

  filename: (_req, file, callback) => {
    const fileHash = crypto.randomBytes(16).toString("hex");
    const fileExtension = path.extname(file.originalname).toLowerCase();

    const fileName = `${fileHash}${fileExtension}`;

    callback(null, fileName);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".glb") {
      return callback(new Error("Apenas arquivos .glb são permitidos."));
    }

    callback(null, true);
  }
});
