import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller";

const router = Router()

router.route("/register-user").post(registerUser)
router.route("/login-user").post(loginUser)
router.route("/logout-user").post(verifyJWT, logoutUser)

export default router