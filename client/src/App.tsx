import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import EditProduct from "./pages/EditProduct";

function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="main">
        <div className="header">
          <div>
            <div className="text-[22px] font-bold text-slate-900">{title}</div>
            <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
          </div>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell
              title="Dashboard"
              subtitle="Inventory performance, stock health, and order activity"
            >
              <Dashboard />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <AppShell
              title="Suppliers"
              subtitle="Manage vendors, sourcing partners, and supplier records"
            >
              <Suppliers />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <AppShell
              title="Products"
              subtitle="Track catalog items, stock levels, and inventory status"
            >
              <Products />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/:id/edit"
        element={
          <ProtectedRoute>
            <AppShell
              title="Edit Product"
              subtitle="Update product data, supplier mapping, pricing, and stock"
            >
              <EditProduct />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AppShell
              title="Orders"
              subtitle="Create and manage purchase and sales orders"
            >
              <Orders />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <AppShell
              title="Order Details"
              subtitle="Review items, fulfillment state, and stock impact"
            >
              <OrderDetails />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<div className="p-6 text-slate-700">Not Found</div>}
      />
    </Routes>
  );
}