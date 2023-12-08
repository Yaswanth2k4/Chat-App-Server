import mongoose  from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        reqired:true
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    chats:{
        type:[{
            client:Boolean,
            message:String,
            time:String,
            isJoined:Boolean
        }]
    },
    room:{
        type:Number,
    },
    socketId:{
        type:Number,
    },
})

export default mongoose.model("User",userSchema)