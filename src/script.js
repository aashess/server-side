
import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { authMiddleware } from './middleware/authMiddleware.js'


const app = express()

const PORT = process.env.PORT || 8383

app.use(cookieParser())

// cors (cross origin resources sharing allows another ip to access)
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
  credentials: true // if you want cookies/auth headers
}))

// middleware to use any form of request to the json. so that it can extract as a req.body otherwise req.body will be undefined. 
app.use(express.json())

app.get('/', (req,res) => {
    res.json("ok")
})

app.use('/auth',authRoutes)
app.use('/todos',todoRoutes)


app.get("/getUser",authMiddleware,(req,res)=>{
    //req.userId
    res.json({message:"ok"})
})



app.listen(PORT, () => {
    console.log(`Server is Started at PORT ${PORT}`)
})