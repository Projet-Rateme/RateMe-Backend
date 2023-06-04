import multer, { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const checkFileExists = (filePath) => {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return filePath;
  } catch (err) {
    return false;
  }
};

export const singleMulter =  multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      cb(null, join(__dirname, '../public/mp3'));
    },
    filename: (req, file, cb) => {
      let newFileName = file.originalname;
  
      // Check if the file already exists and rename it accordingly
      let filePath = `${file.destination}/${newFileName}`;
      let existingFilePath = checkFileExists(filePath);
      let i = 1;
      while (existingFilePath) {
        const extension = newFileName.split('.').pop();
        const fileNameWithoutExtension = newFileName.slice(0, -1 * (extension.length + 1));
        newFileName = `${fileNameWithoutExtension}-${Date.now()}-${i}.${extension}`;
        filePath = `${file.destination}/${newFileName}`;
        existingFilePath = checkFileExists(filePath);
        i++;
      }
  
      cb(null, newFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(mp3|webm|wav|mp4)$/)) {
      return cb(new Error('Please upload an mp3 file.'));
    }
    cb(null, true);
  },
}).single("mp3");

export const multipleMulter = multer({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      cb(null, join(__dirname, '../public/mp3'));
    },
    filename: (req, file, cb) => {
      let newFileName = file.originalname;
  
      // Check if the file already exists and rename it accordingly
      let filePath = `${file.destination}/${newFileName}`;
      let existingFilePath = checkFileExists(filePath);
      let i = 1;
      while (existingFilePath) {
        const extension = newFileName.split('.').pop();
        const fileNameWithoutExtension = newFileName.slice(0, -1 * (extension.length + 1));
        newFileName = `${fileNameWithoutExtension}-${Date.now()}-${i}.${extension}`;
        filePath = `${file.destination}/${newFileName}`;
        existingFilePath = checkFileExists(filePath);
        i++;
      }
  
      cb(null, newFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.mp3$/)) {
      return cb(new Error('Please upload an mp3 file.'));
    }
    cb(null, true);
  },
}).array("mp3Files", 2);

 export const singleImage = multer({
  storage: diskStorage({
    destination: (req, file, callback) => {
      const __dirname = dirname(fileURLToPath(import.meta.url));
      callback(null, join(__dirname, ".." + process.env.IMGURL));
      //for docker
      // callback(null, "/public/images");
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),

  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|JPG|PNG|JPEG)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).single("Image");
