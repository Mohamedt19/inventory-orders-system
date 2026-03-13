import { z } from "zod";

export const createOrderSchema = z.object({
  type: z.enum(["sale", "purchase"]).optional(),
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
  items: z.array(
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export const updateOrderSchema = z.object({
  status: z.enum(["pending", "completed", "cancelled"]).optional(),
});