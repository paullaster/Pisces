import multer, { memoryStorage } from "multer";

const storage = memoryStorage();
export const file = multer({storage: storage});