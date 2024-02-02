import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import config from './config';
import { randomUUID } from 'crypto';

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname);
    const fileName = path.join(randomUUID() + extension);
    cb(null, fileName);
  },
});

export const imagesUpload = multer({ storage: imageStorage });
