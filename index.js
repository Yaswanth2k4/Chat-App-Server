import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import {Server as socketIOServer} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import http from "http";
import { LoginRoute } from "./routes/LoginRoute.js";
import { ChatsRoute } from "./routes/ChatsRoute.js";

const app=express();

dotenv.config()

const server=http.createServer(app)
const io=new socketIOServer(server,{
    cors:{
        origin:[process.env.ORIGIN1,process.env.ORIGINADMIN]
    }
})

io.on("connection",(socket)=>{
    console.log(`User socket id ${socket.id}`)
    socket.on("client-message",(message,room)=>{
        if(room=="")
        {
            socket.broadcast.emit("server-message",message)
        }
        else
        {
            socket.broadcast.to(room).emit("server-message",message)
        }
    })
    socket.on("join-room",(room,name,cb)=>{
        socket.join(room);
        socket.broadcast.to(room).emit("server-joined",name);
        cb(`you joined the room`)
    })
    socket.on("leave-room",(room,name)=>{
        const message=`${name} left the room`
        socket.broadcast.to(room).emit("server-left",message)
    })
})

instrument(io,{auth:false})

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use("/",LoginRoute)
app.use("/chats",ChatsRoute)

mongoose.connect(process.env.DATABASE)

const port=process.env.PORT
server.listen(port,()=>{
    console.log(`server running on port ${port}`)
})