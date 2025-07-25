import mongoose from "mongoose";

const translationHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    inputText: String,
    translatedText: String,
    fromLang: String,
    toLang: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

export const TranslationHistory = mongoose.model("TranslationHistory", translationHistorySchema)