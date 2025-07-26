import {asyncHandler} from "../utils/asynchandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Language } from "../models/Languagepack.models.js"

const uploadLanguagePack = asyncHandler(async(req, res) => {
    try {
        const {name, code, fileUrl, size} = req.body

        const newPack = await Language.create({
            name,
            code, 
            fileUrl,
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