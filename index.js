const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json({limit:"50mb"}))
app.use(cors())
require("dotenv").config()
const studentRouter = require('./routes/student.route')
app.use('/student', studentRouter)
const PORT = process.env.PORT||3000
const URI = process.env.MONGO_URI
const mongoose = require("mongoose")
mongoose.connect(URI,(err)=>{
    if (err) {
        console.log(`I WONT CONNECT TO MONGOOSE`)
        
    } else {
        console.log(`MONGOOSE CONNECTED`)
    }
})

app.listen(PORT,()=>{
    console.log(`LISTENING ON PORT:${PORT}`)
})