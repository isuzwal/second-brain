
import mongoose from "mongoose";
const {Schema} =mongoose;

// User Account
const userScheam=new Schema({
    username:{type:String ,required:true},
    email:{type:String ,required:true,unique:true},
    password:{type:String,required:true}
})

// Noraml Content Add
const ContentScheam=new Schema({
  title:{ type: String, required: true },
  link: { type: String, required: true },
  brain:{type:String,  enum:["youtube" , "twitter" ,"spotify","blog","github"], set: (v:string) => v.trim().toLowerCase()},
  tags:[String],
 description: { type: String },
  image: { type: String },
  userId:{type:mongoose.Types.ObjectId,ref:"user",required:true},
  createdAt: { type: Date, default: Date.now },
},{timestamps:true})
 
// Notes
const NoteSchema=new Schema({
    userId:{type:mongoose.Types.ObjectId,ref:"user",required:true},
    title:{type:String,require:true},
    color:{type:String},
    content:{type:String},
    createdAt: { type: Date, default: Date.now },
})

// Share 
const LinkSchema =new Schema({
     hash:String,
     userId:{type:mongoose.Types.ObjectId,ref:'user',required:true}
})

// Image  
const ImagesScheam=new Schema({
     userId:{type:mongoose.Types.ObjectId,ref:"user",required:true},
    image_URL:{type:String,require:true},
  description: { type: String },
})
export const Link=mongoose.model('link',LinkSchema)
export const User=mongoose.model('user',userScheam);
export const Content=mongoose.model('content',ContentScheam);
export const Notes=mongoose.model('notes',NoteSchema)
export const  Images=mongoose.model('image',ImagesScheam)

