import express from "express";
import {createMessage} from "../controllers/contactus";


const router = express.Router();

router.post("/", createMessage);

export default router;