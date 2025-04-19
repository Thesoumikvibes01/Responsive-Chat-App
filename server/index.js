import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoute.js"
import contactRoutes from "./routes/contactRoutes.js"
import setUpSocket from "./socket.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3001
const databaseUrl  = process.env.DATABASE_URL
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true
}))
app.use("/uploads/profiles",express.static('uploads/profiles'))
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/contacts",contactRoutes)
const server = app.listen(port,()=>{
    console.log(`server is running  at http://localhost:${port}`)
})
setUpSocket(server);
mongoose.connect(databaseUrl).then(()=>{
    console.log("db connected")
}).catch((err)=>{
    console.log(err.message)
})