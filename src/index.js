import connectDB from './db/index.js'
import dotenv from 'dotenv'
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log("Server is runnin on port: ", process.env.PORT);
    })
})

.catch((err) => {
    console.log("MongoDB connection error!!", err);
})