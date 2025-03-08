# Bike Store API
The **Bike Store API** is a robust Express.js application built using TypeScript, integrated with MongoDB (via Mongoose) to manage bike products and customer orders. The API supports CRUD operations for bikes and orders, inventory management, and revenue calculations.

## Features
1. **Product Management (CRUD):**

* Create, read, update, and delete bike products.
* Search and filter bikes by category, brand, or name.
  
2. **Order Management:**

* Place orders for bikes with automatic inventory updates.
* Handle insufficient stock scenarios with meaningful error messages.

3. **Revenue Calculation:**

* Calculate total revenue from all orders using the MongoDB aggregation pipeline.

4. **Validation & Error Handling:**

* Comprehensive validation for all inputs.
* Proper error responses for validation errors, resource not found, and server errors.

5. **Code Quality:**

* Clean and modular code.
* TypeScript for strong typing and scalability.

## Tech Stack
* Backend Framework: Express.js
* Language: TypeScript
* Database: MongoDB with Mongoose
* API Testing: Postman
* Environment Management: dotenv

# Getting Started
### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) Atlas or Local Instance

### Installation

1. Clone the repository:
   
   ```bash
   git clone https://github.com/your-repo/bike-store-api.git
   cd bike-store-api
   
2. Install dependencies:

  ```bash
    npm install
```

3. Create a .env file in the root directory:

  ```env
PORT = 5000
DATABASE_URL =your_mongodb_connection_string
```
4. Start the development server:
  
```bash
npm run dev
```  
The API will be available at http://localhost:5000.

# API Documentation
**1. Product Endpoints**
**Create a Bike**
**POST** /api/products

**Request Body:**

```json
{
  "name": "Xtreme Mountain Bike",
  "brand": "Giant",
  "price": 1200,
  "category": "Mountain",
  "description": "A high-performance bike built for tough terrains.",
  "quantity": 50,
  "inStock": true
}
```
**Response:**

```json
{
  "message": "Bike created successfully",
  "success": true,
  "data": { /* Bike details */ }
}
```
## Get All Bikes
**GET** /api/products

**Response:**

```json

{
  "message": "Bikes retrieved successfully",
  "status": true,
  "data": [ /* Array of bikes */ ]
}
```

## Get a Specific Bike
**GET** /api/products/:productId

**Response:**
```json
{
  "message": "Bike retrieved successfully",
  "status": true,
  "data": { /* Bike details */ }
}
```

## Update a Bike
**PUT** /api/products/:productId

**Request Body:**

```json
{
  "price": 1300,
  "quantity": 30
}
```

## Response:

```json
{
  "message": "Bike updated successfully",
  "status": true,
  "data": { /* Updated bike details */ }
}
```

## Delete a Bike
**DELETE** /api/products/:productId

**Response:**

```json
{
  "message": "Bike deleted successfully",
  "status": true,
  "data": {}
}
```
# 2. Order Endpoints
## Place an Order
**POST** /api/orders

**Request Body:**

```json
{
  "email": "customer@example.com",
  "product": "648a45e5f0123c45678d9012",
  "quantity": 2,
  "totalPrice": 2400
}
```

**Response:**

```json
{
  "message": "Order created successfully",
  "status": true,
  "data": { /* Order details */ }
}
```

## Calculate Revenue
**GET** /api/orders/revenue

**Response:**

```json
{
  "message": "Revenue calculated successfully",
  "status": true,
  "data": {
    "totalRevenue": 3600
  }
}
```

## Testing
**Postman:**

* Use the provided endpoints to test API functionalities.
* Ensure all request and response formats match the specifications.


## Developer
This project is developed by Md. Shofiqul Islam.








