import { Router } from "express";
import {
  Login,
  Signup,
  ContentAdd,
  ContentDelete,
  GetContent,
  Getuser,
  ShareLink,
  GetSharelinkcontent,
  GetBrainContent,
  UploadImage,
  AddNote,
  GetNotes,
  DeleteNote,
  UpdateNote,
} from "../auth-controller-routes/routes.js";
import Usermiddlware from "../middlware/middlware.js";
import { uploadimage } from "../middlware/file-upload.js";

const router = Router();
router.post("/signup", Signup);
router.post("/login", Login);
router.get("/my-detalis", Usermiddlware, Getuser);
router.get("/content", Usermiddlware, GetContent);
router.post("/add-content", Usermiddlware, ContentAdd);
router.post("/upload-image",uploadimage.single("image"),UploadImage)
router.post("/share", Usermiddlware, ShareLink);
router.get("/share-content/:shareLink", GetSharelinkcontent);
router.get("/brain/:brain",Usermiddlware,GetBrainContent)
router.delete("/delete-content", Usermiddlware, ContentDelete);
// notes 
router.post("/add-notes",Usermiddlware,AddNote)
router.get("/notes",Usermiddlware,GetNotes)
router.delete("/delete-notes/:noteId",Usermiddlware,DeleteNote)
router.put("/update-note",Usermiddlware,UpdateNote)
export default router;

