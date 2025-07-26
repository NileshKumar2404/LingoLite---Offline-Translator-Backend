import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getAllLanguagePacks, uploadLanguagePack } from "../controllers/language.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/upload-languagepack").post(
    upload.single('fileUrl'),
    verifyJWT,
    uploadLanguagePack
)
router.route("/get-language-pack").get(verifyJWT, getAllLanguagePacks)

export default router