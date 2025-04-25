# 🚲 Bike Store API

The **Bike Store API** is a robust Express.js backend built with TypeScript and MongoDB (via Mongoose). It supports full CRUD functionality for managing bike products and customer orders, handles inventory, and computes total revenue.

---

## ✨ Features

### ✅ Product Management (CRUD)
- Create, read, update, and delete bikes.
- Filter/search by category, brand, or name.

### 🛒 Order Management
- Place orders with automatic stock deduction.
- Error handling for insufficient stock.

### 💰 Revenue Calculation
- Compute total revenue using MongoDB aggregation.

### 🔒 Validation & Error Handling
- Input validation with clear error responses.

### 🧹 Clean Architecture
- Modular folder structure
- Strong typing using TypeScript

---

## 🧰 Tech Stack

| Tool         | Purpose                 |
|--------------|--------------------------|
| **Express.js** | Backend framework        |
| **TypeScript** | Type-safe JavaScript     |
| **MongoDB**    | NoSQL database           |
| **Mongoose**   | ODM for MongoDB          |
| **dotenv**     | Environment variables    |
| **Postman**    | API testing              |

---

## ⚙️ Getting Started

### 📦 Prerequisites
- Node.js v16+
- MongoDB Atlas or local MongoDB

### 📥 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/bike-store-api.git
   cd bike-store-api
