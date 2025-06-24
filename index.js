import express from 'express'
import { UserRouter } from './routes/user_routes.js'
import mongoose from "mongoose"
import "dotenv/config"
import cors from "cors"
import { AdvertRouter } from './routes/advert_routes.js'
import { dashboardRouter } from './routes/dashboard_routes.js'


const PORT = process.env.PORT || 8000;
const app = express()

const mongouri = process.env.MONGO_URI
mongoose.connect(mongouri)

await mongoose.connect(mongouri)

app.use(express.json());
app.use(cors())


app.use('/api/v1/users', UserRouter)
app.use('/api/v1', AdvertRouter)
app.use('/api/v1/dashboard', dashboardRouter)


app.listen(PORT, () => {
   console.log(`Server is up on port ${PORT}`)
})
