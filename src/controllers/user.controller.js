import {User} from "../models/user.models.js"
import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'

const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(401, "Something went wrong")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {name, email, password} = req.body
    
        if(!name || !email || !password) throw new ApiError(401, "Alll fields are required");
    
        const userExisted = await User.findOne({email})
        if(userExisted) throw new ApiError(401, "User already exists");
    
        const createUser = await User.create({
            name,
            email,
            password
        })

        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(createUser._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            201,
            {
                accessToken, refreshToken, createUser
            },
            "User registered successfully"
        ))
    } catch (error) {
        console.error("Failed to register user: ", error);
    }
})

const loginUser = asyncHandler(async (req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) throw new ApiError(401, "All fields are required");

        const user = await User.findOne({email})
        if(!user) throw new ApiError(401, "User not found");

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid) throw new ApiError(401, "Incorrect password");

        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            201,
            {loggedInUser, accessToken, refreshToken},
            "User logged in successfully."
        ))
    } catch (error) {
        console.error("Failed to login user: ", error);
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: ""
                }
            },
            {new: true}
        )

        if(!user) throw new ApiError(401, "User not found");

        return res
        .status(201)
        .json(new ApiResponse(
            201,
            {},
            "User logged out successfully."
        ))
    } catch (error) {
        console.error("Failed to logout user: ", error);
    }
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized access");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken._id)

        if(!user) throw new ApiError(401, "Refresh Token expired");

        if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");
        
        const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken)
        .json(new ApiResponse(
            201,
            {accessToken, refreshToken},
            "Access token refreshed"
        ))
    } catch (error) {
        console.error("Failed to refresh access token: ", error);
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}