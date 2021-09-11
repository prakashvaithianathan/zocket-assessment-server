const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const dotenv = require('dotenv')
dotenv.config({path:'./config/.env'})
const mongoDB = require('./config/database')
mongoDB()
const routes = require('./routes')

app.get('/', (req, res) => {
    res.send('This is home route')
})
app.use('/',routes)

app.listen(process.env.PORT||5000,()=>{
    console.log('server has been started');
})