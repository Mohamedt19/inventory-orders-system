import {
    createSupplier,
    findSuppliers,
    findSupplierById,
    updateSupplier,
    deleteSupplier
  } from "../services/supplierService.js";
  
  export async function postSupplier(req, res, next) {
    try {
      const supplier = await createSupplier(req.body);
      res.status(201).json(supplier);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getSuppliers(req, res, next) {
    try {
      const suppliers = await findSuppliers();
      res.status(200).json(suppliers);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getSupplier(req, res, next) {
    try {
      const supplier = await findSupplierById(Number(req.params.id));
      if (!supplier) {
        return res.status(404).json({ error: "Supplier not found" });
      }
      res.status(200).json(supplier);
    } catch (err) {
      next(err);
    }
  }
  
  export async function patchSupplier(req, res, next) {
    try {
      const supplier = await updateSupplier(Number(req.params.id), req.body);
      res.status(200).json(supplier);
    } catch (err) {
      next(err);
    }
  }
  
  export async function removeSupplier(req, res, next) {
    try {
      await deleteSupplier(Number(req.params.id));
      res.status(200).json({ message: "Supplier deleted" });
    } catch (err) {
      next(err);
    }
  }