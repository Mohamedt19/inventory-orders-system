import {
    createOrder,
    findOrders,
    findOrderById,
    updateOrder,
    deleteOrder
  } from "../services/orderService.js";
  
  export async function postOrder(req, res, next) {
    try {
      const order = await createOrder(req.body);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getOrders(req, res, next) {
    try {
      const orders = await findOrders();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
  
  export async function getOrder(req, res, next) {
    try {
      const order = await findOrderById(Number(req.params.id));
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
  
  export async function patchOrder(req, res, next) {
    try {
      const order = await updateOrder(Number(req.params.id), req.body);
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
  
  export async function removeOrder(req, res, next) {
    try {
      await deleteOrder(Number(req.params.id));
      res.status(200).json({ message: "Order deleted" });
    } catch (err) {
      next(err);
    }
  }