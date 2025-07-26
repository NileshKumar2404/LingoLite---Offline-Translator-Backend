import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Language } from "../models/Languagepack.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const uploadLanguagePack = asyncHandler(async(req, res) => {
    try {
        const {name, code, size} = req.body

        const localFilePath = req.file?.path
        if (!localFilePath) {
            throw new ApiError(400, "No file found in the request");
        }

        const uploadUrl = await uploadOnCloudinary(localFilePath)
        if(!uploadUrl) throw new ApiError(401, "Failed to upload on cloudinary.")

        const newPack = await Language.create({
            name,
            code, 
            fileUrl: uploadUrl.url,
            size,
            updatedAt: new Date()
        })

        return res
        .status(201)
        .json(new ApiResponse(
            201,
            {newPack},
            "Language pack uploaded"
        ))
    } catch (error) {
        console.error("Failed to upload language pack: ", error);
    }
})

const getAllLanguagePacks = asyncHandler(async(req, res) => {
    try {
        const languagePacks = await Language.aggregate([
            {
                $sort: {
                    updatedAt: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    code: 1,
                    fileUrl: 1,
                    size: 1,
                    updatedAt: 1
                }
            }
        ])

        if(!languagePacks) throw new ApiError(401, "Unable to get language packs.");

        return res
        .status(201)
        .json(new ApiResponse(
            201,
            {languagePacks},
            "Get successfully all the language packs."
        ))
    } catch (error) {
        console.error("Failed to get language packs: ", error);
    }
})

export {
    uploadLanguagePack,
    getAllLanguagePacks
}