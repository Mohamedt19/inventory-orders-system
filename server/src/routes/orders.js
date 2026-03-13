import express from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createOrderSchema,
  updateOrderSchema
} from "../validators/orderSchemas.js";
import {
  postOrder,
  getOrders,
  getOrder,
  patchOrder,
  removeOrder
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/", auth, getOrders);
router.post("/", auth, validate(createOrderSchema), postOrder);
router.get("/:id", auth, getOrder);
router.patch("/:id", auth, validate(updateOrderSchema), patchOrder);
router.delete("/:id", auth, removeOrder);

export default router;