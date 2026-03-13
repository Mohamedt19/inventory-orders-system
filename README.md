# Operations Control Panel

🌐 **Live Demo:** https://inventory-orders-system-client.onrender.com  
📦 **Repository:** https://github.com/Mohamedt19/inventory-orders-system

## Demo Accounts

**Account 1**  
Email: mohamed@example.com  
Password: 123456

**Account 2**  
Email: sara@example.com  
Password: 123456

---

Operations Control Panel is a full-stack inventory and order management application built with **React, TypeScript, Vite, Tailwind CSS, Node.js, Express, Prisma ORM, PostgreSQL, JWT authentication, and Zod validation**.

It is designed as an operations-focused business system for managing products, suppliers, inventory levels, and order workflows through a clean dashboard-style interface.

## Overview

This project demonstrates practical full-stack engineering across:

- authenticated user flows
- protected frontend routes
- relational data modeling
- CRUD operations
- REST API design
- schema validation
- dashboard metrics
- inventory workflow management
- order lifecycle handling
- production-style frontend architecture

The system handles day-to-day operational workflows through product management, supplier tracking, stock monitoring, and purchase or sales order execution.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected frontend routes

### Inventory Management
- Product creation, editing, and deletion
- Supplier creation and deletion
- SKU, pricing, and stock tracking
- Low-stock monitoring
- Supplier assignment per product

### Order Workflow
- Sale and purchase order support
- Multi-item order creation
- Pending, completed, and cancelled order states
- Order details view with itemized totals
- Inventory updates applied through completion workflow

### Dashboard
- Total products
- Low-stock count
- Total orders
- Pending orders
- Low-stock watch table
- System status summary

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- Zod

## Project Structure

```text
inventory-orders-system/
├── client/
│   ├── src/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── types/
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── prisma/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validators/
│
├── screenshots/
│   ├── login.png
│   ├── register.png
│   ├── dashboard.png
│   ├── products.png
│   ├── edit-product.png
│   ├── suppliers.png
│   ├── orders.png
│   └── order-details.png
│
└── README.md
```

## Pages

- Login
- Register
- Dashboard
- Products
- Edit Product
- Suppliers
- Orders
- Order Details

## Core Business Logic

The application supports two order types:

- **Sale Order**
- **Purchase Order**

New orders are created with **pending** status by default.

Inventory changes are applied only when an order is marked **completed**:

- Completing a **sale order** decreases stock
- Completing a **purchase order** increases stock

Completed and cancelled orders are locked from further workflow changes.

This makes the project more realistic than a simple CRUD demo because it models actual business rules around inventory movement and order lifecycle control.

## Example API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Dashboard
- `GET /api/dashboard/summary`

### Suppliers
- `GET /api/suppliers`
- `POST /api/suppliers`
- `DELETE /api/suppliers/:id`

### Products
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

### Orders
- `GET /api/orders`
- `POST /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id`

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Mohamedt19/inventory-orders-system.git
cd inventory-orders-system
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server`:

```env
PORT=3000
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/inventory_orders_db"
JWT_SECRET="super_secret_change_me"
CLIENT_URL="http://localhost:5173"
```

Run migrations:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Optional: seed demo data

```bash
npx prisma db seed
```

Start backend:

```bash
npm run dev
```

### 3. Frontend setup

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:3000
```

## Backend Architecture

```text
routes
↓
middleware
↓
controllers
↓
services
↓
Prisma ORM
↓
PostgreSQL
```

This layered structure keeps request handling, validation, business logic, and database access separated and maintainable.

## Key Learning Areas

This project demonstrates:

- full-stack CRUD architecture
- authentication and authorization
- REST API design
- schema validation
- relational data modeling
- order lifecycle management
- inventory mutation logic
- operational dashboard workflows
- practical React + TypeScript patterns

## Screenshots

### Login
![Login](./screenshots/login.png)

### Register
![Register](./screenshots/register.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Products
![Products](./screenshots/products.png)

### Edit Product
![Edit Product](./screenshots/edit-product.png)

### Suppliers
![Suppliers](./screenshots/suppliers.png)

### Orders
![Orders](./screenshots/orders.png)

### Order Details
![Order Details](./screenshots/order-details.png)

## Future Improvements

- inventory movement history
- product detail pages
- supplier detail pages
- advanced search and filtering
- pagination
- analytics dashboards
- role-based access control
- audit trail for stock updates
- CI/CD deployment pipeline

## Author

**Mohamed Tfagha**  
GitHub: https://github.com/Mohamedt19
LinkedIn: https://www.linkedin.com/in/mohamed-tfagha-b4a460147

