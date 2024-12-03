import multer from 'multer';
import path from 'path';
import express from 'express';
import fs from 'fs';
import randomstring from 'randomstring';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const app = express();
const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'image'); // Gunakan path absolut
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true }); // Pastikan folder dibuat secara rekursif
        }
        cb(null, dir);
    },
    filename: async (req, file, cb) => {
        try {
            const existingFilenames = await prisma.menu.findMany().then((menus) => 
                menus.map((menu) => menu.foto)
            );
            const random = randomstring.generate(7);
            const extension = path.extname(file.originalname);
            const filename = path.basename(file.originalname, extension);

            let newFilename = `${filename}_${random}${extension}`;
            while (existingFilenames.includes(newFilename)) {
                newFilename = `${filename}_${randomstring.generate(7)}${extension}`;
            }
            cb(null, newFilename);
        } catch (err) {
            cb(err); // Tangani error jika terjadi
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, // Maksimal ukuran file 1 MB
    fileFilter: (req, file, cb) => {
        const acceptedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        if (!acceptedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type (${file.mimetype})`));
        }
        cb(null, true);
    }
});

export default upload;
