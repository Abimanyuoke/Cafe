import express from "express";
import bodyParser from "body-parser"
import cors from  "cors"  
import dotenv from "dotenv"
import userRoute from "./routes/user.route.js"
import menuRoute from "./routes/menu.route.js"
import mejaRoute from "./routes/meja.route.js"
import transaksiRoute from "./routes/transaksi.route.js"
const app = express()

dotenv.config()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use("/user", userRoute)
app.use("/menu", menuRoute)
app.use("/meja", mejaRoute)
app.use("/transaksi", transaksiRoute)

app.listen(process.env.app_port,() => {
    console.log("server run on "+ process.env.app_port)
})  