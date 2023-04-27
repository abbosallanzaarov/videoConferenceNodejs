const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const {Server} = require('socket.io')
const server = http.createServer(app)
const {v4} = require('uuid')
const homeRoute = require('./route/homeRoute')
const io = new Server(server)
//EXPRESS CONFIG
app.use(express.json())
app.use(express.urlencoded({extended: true}))
//EJS CONFIG 
app.set('view engine' , 'ejs')
//BOOTSTRAP 
app.use('/bootstrap' , express.static(
    path.join(
        __dirname , 
        "node_modules" ,
        "bootstrap" , 
        "dist")
))
//SOCKET.IO
app.use('/socket' , express.static(
    path.join(
        __dirname , 
        "node_modules" ,
        "socket.io" , 
        "client-dist")
))
// PEER.JS
app.use('/peerjs' , express.static(
    path.join(
        __dirname , 
        "node_modules" ,
        "peerjs" , 
        "dist")
))
app.use('/', express.static(path.join(__dirname , 'public')))
//ROUTER REGISTER
const userData = []
app.use(homeRoute.path , homeRoute.router)
io.on('connection' ,(socket) => {
    let user = userData.find(e => e.socket_id == socket.id)
    if(!user){
        let id = v4()
        user = {
            id:id,
            socket_id: socket.id
        }
        userData.push(user)
        socket.emit('front' , id)
    }
    socket.on('peer' , id  => {
        let userIndex = userData.findIndex(e => e.socket_id == socket.id )
        userData[userIndex]['peer_id'] = id
        user = userData[userIndex]
        console.log(id);
    })
    socket.on('call' ,id => {
        if(id == user.id){
            socket.emit('error' , "error ")
        }else if(userData.findIndex(e => e.id == id) == -1){
            socket.emit('error' , "bunday odma topilmadi ")

        }else{
            let friendId = userData.findIndex(e => e.id == id)
            let user  =userData.find(e => e.socket_id == socket.id)
            socket.to(friendId.socket_id).emit('call' , user.peer_id)
        }
    })
    // console.table(userData)
    socket.on('disconnect' , event => {
        let findUser = userData.findIndex(e => e.socket_id == socket.id) 
        if(findUser  > -1) {
            userData.splice(findUser , 1)

        }
    })
})


server.listen(80)
console.log('server is running ');