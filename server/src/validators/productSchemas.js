import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  supplierId: z.number().int().positive().nullable().optional()
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  sku: z.string().min(2).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  supplierId: z.number().int().positive().nullable().optional()
});