import express from "express";
import {createProduct, deleteProduct, getProduct, getProducts, updateProduct, findOne} from "../controllers/product";
import { verifyToken} from "../verifyToken";
const router = express.Router();

router.post("/",verifyToken, createProduct);
router.put("/:id", updateProduct);
router.delete("/:productId",verifyToken, deleteProduct);
router.get("/products",verifyToken, getProducts);
router.get("/:productId",verifyToken, getProduct);
router.get("/find/:id",verifyToken, findOne);


export default router;
