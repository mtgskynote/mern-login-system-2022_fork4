var createTunnel = require("tunnel-ssh").createTunnel;
const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
const fs = require('fs')
 
const userRoutes = require("./routes/userRoutes")

const app = express()

//console.log(foo)

app.use(cors())
app.use(express.json())

app.use("/users", userRoutes)

const PORT = process.env.PORT || 5000;

const sshOptions = {
	host: 'appskynote.com',
	port: 22,
	username: 'lonce',
    privateKey:fs.readFileSync('c:/Users/lonce/.ssh/id_rsa'),
};

const mySimpleTunnel = (sshOptions, port, autoClose = true) => {
    let forwardOptions = {
        srcAddr:'127.0.0.1',
        srcPort:port,
        dstAddr:'127.0.0.1',
        dstPort:port
    }

    let tunnelOptions = {
        autoClose:autoClose
    }
    
    let serverOptions = {
        host: "127.0.0.1",
        port: port
    }

    console.log("calling createTunnel")
    return createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions, autoClose);
}

//const MONGOOSE_URL = "mongodb://lonce:AirplanE10@appskynote.com:27017/skynote?authSource=skynote&auth"
const MONGOOSE_URL =  "mongodb://lonce:AirplanE10@127.0.0.1:27017/skynote?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=skynote&authMechanism=SCRAM-SHA-256"

mySimpleTunnel(sshOptions, 27017).then(()=>{
    console.log("SimpleTunnel is done!")
    console.log("now connect to mongoose")
    mongoose.connect(MONGOOSE_URL, 
                {useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 20000
                }).then(()=> {
                    console.log("got mongoose connection, to set up server listening")
                    app.listen(PORT, ()=>{
                    console.log(`Server is running at port ${PORT}`);
                })})
            })
