process.env["MONGODB_URL"]='mongodb://tf_jslt_admin:689865541998@tf-jslt.cluster-c7aaqoyekc8g.us-east-1.docdb.amazonaws.com:27017/jslt?tls=false&tlsCAFile=./docdb-bastion.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false'
process.env["MAIL_HOST"]=''
process.env["MAIL_USER"]=''
process.env["MAIL_PASS"]=''
process.env["JWT_SECRET"]=''
process.env["PORT"]=4000


const express = require('express')

const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//calling Database function
require('./config/database').connect()

//route importing and mounting
const user = require('./routes/user')

app.use('/api/v1', user)


app.listen(PORT, ()=>{
    console.log("Server Started")
   
})