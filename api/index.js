import express from "express"
import cors from "cors"
import postRoute from "./routes/post.route.js"
import usersRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import testRoute from "./routes/test.route.js"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies if neededz
  }));


  app.use(express.json())
  app.use(cookieParser())


app.use("/api/post",postRoute)
app.use("/api/users",usersRoute)
app.use("/api/auth",authRoute)
app.use("/api/test",testRoute)



app.listen(5500,()=>{
    console.log("saver is runing!")
})
