# Software Store API

# Zinetov Alikhan 
# Asanov Daniyal

## Overview
This project is a **Software Store API** built with **Node.js, Express, and MongoDB**. It allows users to register, log in, browse software products, add them to their cart, and manage orders.

## Features
- **User Authentication** (Signup, Login)
- **Product Management** (CRUD for software products)
- **Shopping Cart** (Add, Remove, View)
- **MongoDB Database** (via Mongoose ORM)
- **REST API** with JSON responses

---

## Project Structure
```
collection/
│── public/             # Frontend assets (CSS, JS, HTML)
|   ├── app.js
|   ├── index.html
|   ├── cart.html
|   ├── cart.js
|   ├── login.html
|   ├── profile.html
|   ├── signup.html
|   ├── user.js
|   ├── style.css
│── node_modules/       # Dependencies (ignored in Git)
│── server.js           # Main Express server
│── package.json        # Dependencies and scripts
│── package-lock.json   # Dependency lock file
│── .env                # Environment variables (ignored in Git)
│── .gitignore          # Git ignore file
```

---

## Database Structure
The project uses **MongoDB** with the following collections:

### **Users Collection (`users`):**
```json
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "password": String,  // Hashed password
  "avatar": String  // Optional user avatar
}
```

### **Products Collection (`product`):**
```json
{
  "_id": ObjectId,
  "name": String,
  "price": String,  // Format: "£XX.XX"
  "image_url": String,
  "url": String  // Product page URL
}
```

### **Cart Collection (`cart`):**
```json
{
  "_id": ObjectId,
  "userId": ObjectId,  // Reference to Users Collection
  "products": [
    {
      "productId": ObjectId,
      "name": String,
      "price": String,
      "image_url": String,
      "url": String,
      "quantity": Number
    }
  ]
}
```

---

## Setup & Installation
### Clone Repository
```sh
git clone https://github.com/Zikaal/software-store.git
cd software-store
```

### Install Dependencies
```sh
npm install
```

### Run the Server
```sh
npm start
```

---

## API Endpoints
### User Authentication
| Method | Endpoint       | Description         |
|--------|--------------|---------------------|
| POST   | `/signup`     | Register a new user |
| POST   | `/login`      | Log in a user       |

### Product Management
| Method | Endpoint     | Description         |
|--------|-------------|---------------------|
| GET    | `/product`   | Fetch all products  |
| POST   | `/product`   | Add a new product   |
| PUT    | `/product`   | Update a product    |
| DELETE | `/product/:id` | Remove a product  |

### Cart Management
| Method | Endpoint         | Description          |
|--------|----------------|----------------------|
| POST   | `/cart`         | Add product to cart |
| GET    | `/cart/:userId` | View user's cart    |
| DELETE | `/cart/:userId/:productId` | Remove product from cart |

---

## License
This project is licensed under the **MIT License**.

---


