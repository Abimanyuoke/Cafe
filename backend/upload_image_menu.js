import multer from 'multer'
import path from 'path'
import express from 'express'
import fs from 'fs'
import randomstring from "randomstring"
import { PrismaClient } from "@prisma/client";
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'

const app = express()
const prisma = new PrismaClient()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '/image';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, path.join(__dirname, `/image`), function (err, sucess) {
            if (err) {
                throw err;
            }
        });
    },
    filename: (req, file, cb) => {
      const getFilenames = () => {
        return prisma.menu.findMany().then((tipe) => {
          return tipe.map((t) => t.foto);
        });
      };
    
      const random = randomstring.generate(7);
      const extension = path.extname(file.originalname);
      const filename = path.basename(file.originalname, extension);
    
      getFilenames().then((filenames) => {
        let newFilename = `${filename}_${random}${extension}`;
        while (filenames.includes(newFilename)) {
          newFilename = `${filename}_${randomstring.generate(7)}${extension}`;
        }
        cb(null, newFilename);
      });
    }
    
      
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`]
        if (!acceptedType.includes(file.mimetype)) {
            cb(null, false)
            return cb(`Invalid file type(${file.mimetype})`)
        }

        const filesize = req.headers[`content-length`]
        const maxSize = (1 * 1024 * 1024)
        if (filesize > maxSize) {
            cb(null, false)
            return cb(`File size is too large`)
        }
        cb(null, true)
    }
})

export default upload