import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { uploadExcel } from "../middlewares/multer.js";
import verifyAuth from "../middlewares/verifyAuth.js";
import verifyRole from "../middlewares/verifyRole.js";

export const router = Router();

router.get("/products", productController.getAllProducts);
router.post(
  "/products/import",
  verifyAuth,
  verifyRole("admin"),
  uploadExcel.single("file"),
  productController.importFromExcel,
);
router.delete(
  "/products/:id",
  verifyAuth,
  verifyRole("admin"),
  productController.deleteProductById,
);
router.get("/products/:id", productController.getProductById);
router.put(
  "/products/:id",
  verifyAuth,
  verifyRole("admin"),
  productController.updateProductById,
);
