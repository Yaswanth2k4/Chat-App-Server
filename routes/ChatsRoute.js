import express from "express";
import cors from "cors";
import User from "../models/UserSchema.js";

const router=express.Router();
router.use(express.urlencoded({extended:true}));
router.use(cors());

router.get("/getchats/:uid",async(req,res)=>{
    const user=await User.findById({_id:req.params.uid})
    res.json(user.chats);
})

router.post("/addchat/:uid",async(req,res)=>{
    const user=await User.findById({_id:req.params.uid});
    const date=new Date();
    const time=date.getHours().toString().concat(":",String(date.getMinutes()).padStart(2,"0"))
    user.chats.push({
                    message:req.body.message,
                    client:req.body.client,
                    time:time,
                    isJoined:req.body.isJoined
                })
    user.save();
    res.json(user.chats[user.chats.length-1]);
})

export {router as ChatsRoute};