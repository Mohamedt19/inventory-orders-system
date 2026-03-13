export type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  
  export type LoginResponse = {
    token: string;
  };
  
  export type DashboardSummary = {
    totalProducts: number;
    lowStockProducts: number;
    totalOrders: number;
    pendingOrders: number;
  };
  
  export type Supplier = {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    createdAt: string;
  };
  
  export type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock: number;
    createdAt: string;
    updatedAt: string;
    supplier: Supplier | null;
  };
  
  export type OrderStatus = "pending" | "completed" | "cancelled";
  
  export type OrderItem = {
    id: number;
    quantity: number;
    unitPrice: number;
    product: Product;
  };
  
  export type Order = {
    id: number;
    status: OrderStatus;
    total: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
  };