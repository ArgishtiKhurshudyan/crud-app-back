import {Router} from "express";
import {createColor, updateColor, deleteColor, getColors} from '../controllers/color';
import {verifyToken} from "../verifyToken";
import {findOneColor} from "../controllers/color";

const router = Router()

router.post("/", verifyToken, createColor)
router.put("/:id", updateColor)
router.delete("/:id", verifyToken, deleteColor)
router.get("/", verifyToken, getColors)
router.get("/find/:id",verifyToken, findOneColor);

export default router;