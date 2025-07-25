import mongoose from "mongoose";

const languageSchema = new mongoose.Schema({
    name: String,
    code: String,
    fileUrl: String,
    size: String,
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export const Language = mongoose.model("Language", languageSchema)