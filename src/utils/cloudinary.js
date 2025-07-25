import {v2 as cloudinary} from "cloudinary"
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) {
            console.error("Local file path is missing.");
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        fs.unlinkSync(localFilePath)
        return response        
    } catch (error) {
        console.error("Error uploading on cloudinary: ", error);
        fs.unlinkSync(localFilePath)
    }
}

export {uploadOnCloudinary}