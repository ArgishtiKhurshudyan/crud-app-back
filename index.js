const express = require("express");
const dotenv = require("dotenv")
import routerUser from "./routes/user";
import authRouter from "./routes/auth";
import colorRouter from "./routes/color"
import productRouter from "./routes/product"
import cookieParser from "cookie-parser"
import cors from "cors"


dotenv.config()

const app = express()
const PORT = process.env.PORT || 3333;
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)
app.use("/api/product", productRouter)
app.use("/api/color", colorRouter)
app.use("/api/user", routerUser)


app.listen(PORT, () => {
  console.log(`connected on port ${PORT}`)
})

