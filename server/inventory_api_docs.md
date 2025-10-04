# Inventory Management API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
Most endpoints require Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token_here>
```

---

## 1. Authentication Endpoints

### 1.1 Register New User
**Endpoint:** `POST /auth/register`

**Description:** Creates a new user account. An OTP is sent to the provided email address for verification. Users cannot log in until their email is verified.

**Request Body:**
```json
{
  "name": "Test User",
  "email": "test_user1@yopmail.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "message": "OTP sent to your email. Please verify."
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "User already exists and is verified."
}
```

---

### 1.2 Verify Email with OTP
**Endpoint:** `POST /auth/verify-otp`

**Description:** Verifies the user's email using the OTP sent during registration. Upon successful verification, returns user details and a JWT authentication token.

**Request Body:**
```json
{
  "email": "test_user1@yopmail.com",
  "otp": "648494"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Email verified successfully.",
  "user": {
    "id": "cmg927a9g0001usg0u6d6q2id",
    "name": "Test User",
    "email": "test_user1@yopmail.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "User is already verified."
}
```

---

### 1.3 Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticates existing users and returns user details along with a JWT token for accessing protected resources.

**Request Body:**
```json
{
  "email": "",
  "password": ""
}
```

**Success Response (200 OK):**
```json
{
  "id": "cmg91ncsc0000usg065imujep",
  "name": "Test User",
  "email": "test_user@yopmail.com",
  "role": "USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- **401 Unauthorized:** Invalid credentials
- **500 Internal Server Error:** Server error or malformed request

---

## 2. Product Endpoints

### 2.1 Get All Products
**Endpoint:** `GET /products/`

**Authentication:** Required (Bearer token)

**Description:** Retrieves a list of all products in the inventory.

**Success Response (200 OK):**
```json
[]
```
*Returns an array of product objects*

**Error Response (401 Unauthorized):**
```json
{
  "message": "Not authorized, no token."
}
```

---

### 2.2 Get Single Product
**Endpoint:** `GET /products/:id`

**Authentication:** Required (Bearer token)

**Description:** Retrieves detailed information about a specific product, including category, supplier, and movement history.

**URL Parameters:**
- `id` - Product ID

**Success Response (200 OK):**
```json
{
  "id": "cmg92vg9t0009uso43u54bmni",
  "name": "Wireless Ergonomic Mouse",
  "sku": "MSE-ERGO-WL-25",
  "description": "Comfortable mouse for all-day use.",
  "quantity": 200,
  "price": 79.99,
  "createdAt": "2025-10-02T07:12:29.730Z",
  "updatedAt": "2025-10-02T07:12:29.730Z",
  "categoryId": "cmg92vg7u0002uso4veg6vb6v",
  "supplierId": "cmg92vg8q0004uso4c4mj0sct",
  "category": {
    "id": "cmg92vg7u0002uso4veg6vb6v",
    "name": "Electronics"
  },
  "supplier": {
    "id": "cmg92vg8q0004uso4c4mj0sct",
    "name": "Global Tech Inc.",
    "contactName": "Jane Doe",
    "contactEmail": "jane.doe@globaltech.com",
    "contactPhone": "111-222-3333"
  },
  "movements": []
}
```

---

### 2.3 Create Product
**Endpoint:** `POST /products/`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Creates a new product in the inventory. Only administrators can create products.

**Request Body:**
```json
{
  "name": "Laptop",
  "sku": "LP-123",
  "description": "A powerful laptop",
  "quantity": 50,
  "price": 1200,
  "categoryId": "cmg92vg7u0002uso4veg6vb6v",
  "supplierId": "cmg92vg8q0004uso4c4mj0sct"
}
```

**Success Response (201 Created):**
```json
{
  "id": "cmg94gkr50003usdsrmzo2yu3",
  "name": "Laptop",
  "sku": "LP-123",
  "description": "A powerful laptop",
  "quantity": 50,
  "price": 1200,
  "createdAt": "2025-10-02T07:56:54.929Z",
  "updatedAt": "2025-10-02T07:56:54.929Z",
  "categoryId": "cmg92vg7u0002uso4veg6vb6v",
  "supplierId": "cmg92vg8q0004uso4c4mj0sct"
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Forbidden: You do not have the required permissions."
}
```

---

### 2.4 Update Product
**Endpoint:** `PUT /products/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Updates an existing product's information. Only administrators can modify products.

**URL Parameters:**
- `id` - Product ID

**Request Body:**
```json
{
  "price": 1150.50,
  "quantity": 45
}
```

**Success Response (200 OK):**
```json
{
  "id": "cmg92vgad000buso46fbenm2o",
  "name": "A4 Printer Paper (500 Sheets)",
  "sku": "PPR-A4-500S",
  "description": "High-quality paper for all office printers.",
  "quantity": 45,
  "price": 1150.5,
  "createdAt": "2025-10-02T07:12:29.749Z",
  "updatedAt": "2025-10-02T07:58:47.862Z",
  "categoryId": "cmg92vg850003uso476f711n0",
  "supplierId": "cmg92vg8x0005uso4cvcry89g"
}
```

**Error Responses:**
- **403 Forbidden:** User does not have admin permissions
- **500 Internal Server Error:** Product ID not found

---

### 2.5 Delete Product
**Endpoint:** `DELETE /products/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Deletes a product from the inventory. Only administrators can delete products.

**URL Parameters:**
- `id` - Product ID

**Success Response (204 No Content):**
*No body returned*

**Error Response (403 Forbidden):**
```json
{
  "message": "Forbidden: You do not have the required permissions."
}
```

---

## 3. Supplier Endpoints

### 3.1 Get All Suppliers
**Endpoint:** `GET /suppliers`

**Authentication:** Required (Bearer token)

**Description:** Retrieves a list of all suppliers along with their associated products.

**Success Response (200 OK):**
```json
[
  {
    "id": "cmg9j2u1a0004usqgxsosgog5",
    "name": "Global Tech Inc.",
    "contactName": "Jane Doe",
    "contactEmail": "jane.doe@globaltech.com",
    "contactPhone": "111-222-3333",
    "products": [...]
  }
]
```

---

### 3.2 Get Single Supplier
**Endpoint:** `GET /suppliers/:id`

**Authentication:** Required (Bearer token)

**Description:** Retrieves detailed information about a specific supplier, including all products they supply.

**URL Parameters:**
- `id` - Supplier ID

**Success Response (200 OK):**
```json
{
  "id": "cmg9j2u1a0004usqgxsosgog5",
  "name": "Global Tech Inc.",
  "contactName": "Jane Doe",
  "contactEmail": "jane.doe@globaltech.com",
  "contactPhone": "111-222-3333",
  "products": [
    {
      "id": "cmg9j2xxl0007usqg11crd6bu",
      "name": "14\" Laptop Pro",
      "sku": "LP-PRO-14-2025",
      "description": "High-performance laptop for professionals.",
      "quantity": 50,
      "price": 1499.99,
      "createdAt": "2025-10-02T14:46:13.066Z",
      "updatedAt": "2025-10-02T14:46:13.066Z",
      "categoryId": "cmg9j2r510002usqgbt8bcnhd",
      "supplierId": "cmg9j2u1a0004usqgxsosgog5"
    }
  ]
}
```

---

### 3.3 Create Supplier
**Endpoint:** `POST /suppliers`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Creates a new supplier in the system. Only administrators can create suppliers.

**Request Body:**
```json
{
  "name": "NextGen Solutions Ltd.",
  "contactName": "Jane Doe",
  "contactEmail": "jane.doe@nextgen.com",
  "contactPhone": "111-222-3333"
}
```

**Success Response (201 Created):**
```json
{
  "id": "cmgbv169e0002uspgd6wdzdni",
  "name": "NextGen Solutions Ltd.",
  "contactName": "Jane Doe",
  "contactEmail": "jane.doe@nextgen.com",
  "contactPhone": "111-222-3333"
}
```

---

### 3.4 Update Supplier
**Endpoint:** `PUT /suppliers/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Updates an existing supplier's information. Only administrators can modify suppliers.

**URL Parameters:**
- `id` - Supplier ID

**Request Body:**
```json
{
  "contactPhone": "999-555-5666"
}
```

**Success Response (200 OK):**
```json
{
  "id": "cmg9j2u1a0004usqgxsosgog5",
  "name": "Global Tech Inc.",
  "contactName": "Jane Doe",
  "contactEmail": "jane.doe@globaltech.com",
  "contactPhone": "999-555-5666"
}
```

---

### 3.5 Delete Supplier
**Endpoint:** `DELETE /suppliers/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Deletes a supplier from the system. Suppliers with associated products cannot be deleted due to foreign key constraints.

**URL Parameters:**
- `id` - Supplier ID

**Success Response (204 No Content):**
*No body returned*

**Error Response (500 Internal Server Error):**
```json
{
  "message": "Foreign key constraint violated on the fields: (`supplierId`)"
}
```
*This occurs when trying to delete a supplier that has products associated with it.*

---

## 4. Category Endpoints

### 4.1 Get All Categories
**Endpoint:** `GET /categories`

**Authentication:** Required (Bearer token)

**Description:** Retrieves a list of all product categories along with their associated products.

**Success Response (200 OK):**
```json
[
  {
    "id": "cmg92vg7u0002uso4veg6vb6v",
    "name": "Electronics",
    "products": [
      {
        "id": "cmg92vg9i0007uso47ekxbf6h",
        "name": "14\" Laptop Pro",
        "sku": "LP-PRO-14-2025",
        "description": "High-performance laptop for professionals.",
        "quantity": 50,
        "price": 1499.99,
        "createdAt": "2025-10-02T07:12:29.717Z",
        "updatedAt": "2025-10-02T07:12:29.717Z",
        "categoryId": "cmg92vg7u0002uso4veg6vb6v",
        "supplierId": "cmg92vg8q0004uso4c4mj0sct"
      }
    ]
  }
]
```

---

### 4.2 Get Single Category
**Endpoint:** `GET /categories/:id`

**Authentication:** Required (Bearer token)

**Description:** Retrieves detailed information about a specific category, including all products within that category.

**URL Parameters:**
- `id` - Category ID

**Success Response (200 OK):**
```json
{
  "id": "cmg92vg7u0002uso4veg6vb6v",
  "name": "Electronics",
  "products": [...]
}
```

---

### 4.3 Create Category
**Endpoint:** `POST /categories`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Creates a new product category. Only administrators can create categories.

**Request Body:**
```json
{
  "name": "Furniture"
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Forbidden: You do not have the required permissions."
}
```

---

### 4.4 Update Category
**Endpoint:** `PUT /categories/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Updates an existing category's information. Only administrators can modify categories.

**URL Parameters:**
- `id` - Category ID

**Request Body:**
```json
{
  "name": "Updated Category Name"
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "Forbidden: You do not have the required permissions."
}
```

---

### 4.5 Delete Category
**Endpoint:** `DELETE /categories/:id`

**Authentication:** Required (Bearer token - ADMIN role only)

**Description:** Deletes a category from the system. Categories with associated products cannot be deleted due to foreign key constraints.

**URL Parameters:**
- `id` - Category ID

**Error Response (403 Forbidden):**
```json
{
  "message": "Forbidden: You do not have the required permissions."
}
```

---

## User Roles

The API supports two user roles:

1. **USER**: Can view products, suppliers, and categories
2. **ADMIN**: Has full access including create, update, and delete operations

---

## Error Handling

All endpoints may return the following error responses:

- **400 Bad Request**: Invalid request format or missing required fields
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: User lacks required permissions (e.g., non-admin attempting admin operations)
- **404 Not Found**: Requested resource does not exist
- **500 Internal Server Error**: Server-side error with detailed error message and stack trace

Error responses typically include:
```json
{
  "message": "Error description",
  "stack": "Detailed stack trace (in development mode)"
}
```

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. The JWT token expires after 30 days
3. Price values are stored as decimal numbers
4. SKU (Stock Keeping Unit) should be unique for each product
5. Foreign key constraints prevent deletion of suppliers or categories that have associated products