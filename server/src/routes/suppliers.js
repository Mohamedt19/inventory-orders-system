import express from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createSupplierSchema,
  updateSupplierSchema
} from "../validators/supplierSchemas.js";
import {
  postSupplier,
  getSuppliers,
  getSupplier,
  patchSupplier,
  removeSupplier
} from "../controllers/supplierController.js";

const router = express.Router();

router.get("/", auth, getSuppliers);
router.post("/", auth, validate(createSupplierSchema), postSupplier);
router.get("/:id", auth, getSupplier);
router.patch("/:id", auth, validate(updateSupplierSchema), patchSupplier);
router.delete("/:id", auth, removeSupplier);

export default router;