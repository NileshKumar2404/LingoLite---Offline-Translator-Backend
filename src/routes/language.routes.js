import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getAllLanguagePacks, uploadLanguagePack } from "../controllers/language.controller.js";

const router = Router()

router.route("/upload-languagepack").post(verifyJWT, uploadLanguagePack)
router.route("/get-language-pack").get(verifyJWT, getAllLanguagePacks)

export default router