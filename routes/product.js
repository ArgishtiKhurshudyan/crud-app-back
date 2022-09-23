import express from "express";
import {createProduct, deleteProduct, getProduct, getProducts, updateProduct} from "../controllers/product";
import { verifyToken} from "../verifyToken";
const router = express.Router();

router.post("/",verifyToken, createProduct);
router.put("/:productId",verifyToken, updateProduct);
router.delete("/:productId",verifyToken, deleteProduct);
router.get("/products",verifyToken, getProducts);
router.get("/:productId",verifyToken, getProduct);


export default router;
