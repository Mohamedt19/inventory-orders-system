import express from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createProductSchema,
  updateProductSchema
} from "../validators/productSchemas.js";
import {
  postProduct,
  getProducts,
  getProduct,
  patchProduct,
  removeProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", auth, getProducts);
router.post("/", auth, validate(createProductSchema), postProduct);
router.get("/:id", auth, getProduct);
router.patch("/:id", auth, validate(updateProductSchema), patchProduct);
router.delete("/:id", auth, removeProduct);

export default router;