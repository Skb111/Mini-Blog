import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir,{ recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname} -${uniqueSuffix}${ext}`);
    },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    if(/^image\//.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

export default upload;


    // const allowedTypes = /jpeg|jpg|png|gif/;
    // const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = allowedTypes.test(file.mimetype);