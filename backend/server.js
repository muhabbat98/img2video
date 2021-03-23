// express 
const express = require(`express`)
// app 
const app = express()
// port 
const port = process.env.PORT || 9000


// cors 
const cors  = require("cors")
app.use(cors())
// static folder 
app.use(express.static(__dirname + `/assets`))
// uploadController 
const uploadController = require('./upload')

// post
app.post(`/`, uploadController)

// server listen 
app.listen(port, ()=>{ console.log(port)})