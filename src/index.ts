 import express from "express";
 import cors from "cors"
 import connectDB from "./database/connection.js";
 import dotenv from "dotenv";
 import userRouter from "./allroutes/userRouter.js"

 dotenv.config();
 
 const app=express(); 
 const PORT=3000;

 app.use(express.json());
 app.use(cors({
     origin:["http://localhost:5173" ,"https://second-brain-eosin.vercel.app","https://orbix-brain.vercel.app"],
    allowedHeaders:['Content-Type','Authorization'],
    methods:['GET','POST','PUT','DELETE','OPTIONS'],
    credentials:true
 }));

 connectDB();

 app.get("/",(req,res)=>{
    res.send("Second Barin Backend")
 })
 
 app.use("/api/v1/brain/user",userRouter)
 

 app.listen(PORT,()=>{
    console.log("Server is Running at PORT",PORT)
 })

