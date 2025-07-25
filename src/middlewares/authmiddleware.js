import jwt from 'jsonwebtoken'
import {asyncHandler} from "../utils/asynchandler.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

        if(!token) throw new ApiError(401, "Unautorized access");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id).select('-password -refreshToken')

        if(!user) throw new ApiError(404, "Invalid access token")

        req.user = user
        next()
    } catch (error) {
        console.error("JWT verification error: ", error.message);
        throw new ApiError(404, error.message|| "Invalid access token")
    }
})