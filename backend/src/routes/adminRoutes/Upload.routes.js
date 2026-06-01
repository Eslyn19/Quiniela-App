import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir  = path.join(__dirname, '../../../../uploads/premios');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename:    (_req, file, cb) => {
        // Mantener nombre original, solo limpiar espacios y caracteres peligrosos
        const ext      = path.extname(file.originalname).toLowerCase();
        const base     = path.basename(file.originalname, path.extname(file.originalname));
        const clean    = base.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
        const name     = `${clean}${ext}`;
        cb(null, name);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    },
});

const router = Router();

router.post('/upload/premio-imagen', upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Archivo inválido o no enviado' });
    const url = `/uploads/premios/${req.file.filename}`;
    return res.json({ url });
});

export default router;
