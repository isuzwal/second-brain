import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User, Content, Link, Notes } from "../database/db.js";

import jwt from "jsonwebtoken";
import { random } from "../hash.js";
const JWT = process.env.JWT;
const salt = await bcryptjs.genSalt(10);

export const Signup = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    // first chehck
    if (!email || !username || !password) {
      res.status(400).json({
        status: false,
        message: "Username and email  are required",
      });
    }
    // check is user present already or not in db
    const isExisting = await User.findOne({ email });
    if (isExisting) {
      return res.status(411).json({
        status: false,
        message: "User already Logged In !!",
      });
    }
    // hasing password
    const hashpassword = await bcryptjs.hashSync(password, salt);
    // creating user account
    await User.create({
      username: username,
      password: hashpassword,
      email: email,
    });
    return res.status(201).json({
      status: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("At the signup route", error);
    res.status(500).json({
      status: false,
      error: "Internal Server problem !!",
    });
  }
};

// login user account
export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Ispresnt on db
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(400).json({
        status: false,
        error: "Account does't exist !",
      });
    }
    //  check is paswword matach
    const IsmatchPasswords = await bcryptjs.compare(password, user!.password);
    if (!IsmatchPasswords) {
      return res.status(400).json({
        status: false,
        error: "Invalid credentials",
      });
    }
    // Send the  JWT token to user
    if (!JWT) {
      throw new Error("Not JWT token ");
    }
    const token = jwt.sign({ id: user?._id }, JWT, { expiresIn: "7d" });
    return res.status(200).json({
      status: true,
      message: "Login sucessfull",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// --> Add content
export const ContentAdd = async (req: Request, res: Response) => {
  const { title, link, tags,  brain, description,image} = req.body;
 
  if (!title) {
    return res.status(404).json({
      status: false,
      error: "Title is requried !",
    });
  }
  try {
    await Content.create({
      title,
      link,
      userId: req.userId,
      tags:
        typeof tags === "string"
          ? tags.split(",").map((t) => t.trim()) // "youtube,vibe" → ["youtube","vibe"]
          : tags,
      brain,
     
      description,
      image
    });
    return res.status(201).json({
      status: true,
      message: "Content add successfully ",
    });
  } catch (error) {
   
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// get user Info
export const Getuser = async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById({ _id: userId }).select("-password");
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Can't find user account !",
      });
    }

    return res.status(200).json({
      status: true,
      data: user,
      message: "user infromation  !",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went Wrong !",
    });
  }
};
// --> get content
export const GetContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.find({ userId: req.userId }).populate("userId", "username");
    return res.status(200).json({
      statu: true,
      data: content,
    });
  } catch (error) {
  
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// --> delete content
export const ContentDelete = async (req: Request, res: Response) => {
  const { contentId } = req.body;
 
  try {
    const content = await Content.findOne({ _id: contentId });
    if (!content) {
      return res.status(404).json({
        status: false,
        errorr: "Did't Finf Content",
      });
    }
    await Content.findByIdAndDelete({ contentId, userId: req.userId });
    return res.status(200).json({
      status: true,
      message: " Content delete Succefully ",
    });
  } catch (error) {
    console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// share able link
export const ShareLink = async (req: Request, res: Response) => {
  const share = req.body.share;
  
  try {
    if (share) {
      const existingLink = await Link.findOne({
        userId: req.userId,
      });
      if (existingLink) {
        return res.status(200).json({
          status: true,
          hash: existingLink.hash,
        });
      }
      const hash = random(10);
      await Link.create({
        userId: req.userId,
        hash: hash,
      });
      return res.status(200).json({
        status: true,
        hash,
        message: "Share able Link !",
      });
    } else {
      await Link.deleteOne({
        userId: req.userId,
      });
    }
    return res.status(200).json({
      status: true,
      message: "Remove sharable Link",
    });
  } catch (error) {

    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
// after the share link
export const GetSharelinkcontent = async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  try {
    const link = await Link.findOne({
      hash: hash,
    });
    if (!link) {
      return res.status(400).json({
        status: false,
        error: "Can't get ShareLink Dcoument !",
      });
    }
    // find the content
    const content = await Content.find({
      userId: link?.userId,
    }).populate("userId","username");
    // find the userdata
    const user = await User.findOne({
      _id: link?.userId,
    })
    if (!user) {
      return res.status(411).json({
        status: false,
        error: "User may not exist !!",
      });
    }
    res.status(200).json({
      username: user.username,
      content: content,
    });
  } catch (error) {
    console.error("At the delete route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};


export const GetBrainContent = async (req: Request, res: Response) => {
  const {brain} = req.params; 
  const user_id=req.userId;

  try {
    if (!brain || !user_id) {
      return res.status(400).json({
        status: false,
        message: "Account not Login !",
      });
    }
    // db check
    const data = await Content.find(
      { brain: brain,userId:user_id }
    ).populate("userId", "username");
    if (!data) {
      return res.status(404).json({
        status: false,
        message: "Content not found !",
      });
    }

    return res.status(200).json({
      status: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};

export const UploadImage=async(req:Request,res:Response)=>{
   try {
     if (!req.file) {
        return res.status(400).json({
          status: "Fail",
          msg: "No file uploaded"
        });
      }
    console.log("File uploaded:", req.file);
     const link = req.file.path;
      res.json({ link: link });
  } catch (error) {
 
    res.status(500).json({ message: "Upload failed" });
  }
}



export const AddNote = async (req: Request, res: Response) => {
  const { title, content, color } = req.body;
  const userId = req.userId;
 
  try {
    if (!title || !content) {
      return res.status(400).json({
        status: false,
        message: "Title and content are required!",
      });
    }

    await Notes.create({
      title,
      content,
      color,
      userId,
    });

    return res.status(201).json({
      status: true,
      message: "Note added successfully!",
    });
  } catch (error) {
    console.error("At the AddNote route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};


export const GetNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Notes.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      status: true,
      data: notes,
    });
  } catch (error) {

    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};


export const UpdateNote = async (req: Request, res: Response) => {
  const { noteId, title, content, color } = req.body;
  try {
    const note = await Notes.findOne({ _id: noteId, userId: req.userId });
    if (!note) {
      return res.status(404).json({
        status: false,
        message: "Note not found!",
      });
    }

    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;
    await note.save();

    return res.status(200).json({
      status: true,
      message: "Note updated successfully!",
    });
  } catch (error) {
    console.error("At the UpdateNote route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};


export const DeleteNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;

  try {
    const note = await Notes.findOne({ _id: noteId, userId: req.userId });
    if (!note) {
      return res.status(404).json({
        status: false,
        message: "Note not found!",
      });
    }

    await Notes.findByIdAndDelete(noteId);
    return res.status(200).json({
      status: true,
      message: "Note deleted successfully!",
    });
  } catch (error) {
    console.error("At the DeleteNote route", error);
    return res.status(500).json({
      status: false,
      error: "Internal Server Error!",
    });
  }
};
