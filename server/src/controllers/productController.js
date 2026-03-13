import {
    createProduct,
    findProducts,
    findProductById,
    updateProduct,
    deleteProduct
  } from "../services/productService.js";
  
  export async function postProduct(req, res, next) {
    try {
      const product = await createProduct(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getProducts(req, res, next) {
    try {
      const products = await findProducts();
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getProduct(req, res, next) {
    try {
      const product = await findProductById(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }
  
  export async function patchProduct(req, res, next) {
    try {
      const product = await updateProduct(Number(req.params.id), req.body);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }
  
  export async function removeProduct(req, res, next) {
    try {
      await deleteProduct(Number(req.params.id));
      res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      next(err);
    }
  }