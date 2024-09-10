# project-july
2project
### PostMan

**Endpoints to use in the back-office:**

1. **Get the list of products:**
   - **URL:** `http://localhost:4000/api/products`
   - **Description:** Retrieves the list of products using the `getProducts` function.
   - **Method:** GET

2. **Get images of a specific product:**
   - **URL:** `http://localhost:4000/api/products/:id/image-urls`
   - **Descriptión:** This endpoint use the function `getProductImageUrl` to get the images of asociated product. Return images organized by categories  (product, contextual, transparent).
   - **Méthod:** GET
   - **Example:** `http://localhost:4000/api/products/66985bd197cb0122cd7e42b8/image-urls`

3. **Get a specific image of a product:**
   - **URL:** `http://localhost:4000/api/products/:productId/images/:category/:index`
   - **Descriptión:** This endpoint use the function  `getProductImageByIndex` to show a transformed image of an specific product. Firs the product Id, then the category of the image and the index of the image in the category array.
   - **Méthod:** GET
   - **Example:** `http://localhost:4000/api/products/66985bd197cb0122cd7e42b8/images/product/1`    

   **For administrative uses to:
4. **Create a product:**
   - **URL:** `http://localhost:4000/api/products
   - **Description:** This endpoint uses the`createProduct` function. To test it you need -in POSTMAN to create a JSON raw and provide the relative path to the images.
   - **Method:** POST
   - **Example:** 
        ```json-
     {
      "name": "Mallorcan chair",
      "description": "Wicker chair inspired by Mallorcan style",
      "price": 99.99,
      "categories": ["furniture", "living room"],
      "materials": ["Wicker"],
      "images": [
        {
          "path": "data/productImages/wicker chair Mallorcan style.webp",
          "description": "Angle view"
        }
      ],
      "stock": 50,
      "featured": true
    }
    ```
   ******************************************************



### 5. **Create User:**
   - **URL** `http://localhost:4000/user/signup`
   - **Description:** Creates a new user with the provided details.
   - **Method:** POST
   - **Example: Body/raw/JSON**
         ```json-
     {
      "username": "testuser",
      "email": "testuser@example.com",
      "password": "Test@1234",
      "phone": "1234567890",
      "isAdmin": false,
      "street": "123 Main St",
      "apartment": "4B",
      "zip": "12345",
      "city": "Test City",
      "country": "Test Country"
}
    ```
   ******************************************************
### 6. **Log in:**
   - **URL** `http://localhost:4000/user/login/`
   - **Description:** Logs in the user and returns a JWT token.
   - **Method:** POST
   - **Example: Body/ram/JSON**
         ```json-
      {
      "email": "testuser@example.com",
      "password": "Test@1234"
      }
    ```
   ******************************************************

### 7. **To get all Users:**
   - **URL** `http://localhost:4000/user/allusers`
   - **Description:** Retrieves all users from the database.
   - **Method:** GET
   - **Example:** 

### 8. **Logged in:**
   - **URL** `http://localhost:4000/user/profile`
   - **Description:** Retrieves the logged-in user's profile details.
   - **Method:** GET
   - **Example Request Headers** Key: token, Value: <your_jwt_token_here>
         
      
   ******************************************************

### 9. **Update user:**
   - **URL** `http://localhost:4000/user/update/`
   - **Description:**  Updates the logged-in user's details.
   - **Method:** PUT
   - **Example Request Headers** Key: token, Value: <your_jwt_token_here>
         ```json-
      {
      "name": "updateduser",
      "email": "updateduser@example.com",
      "phone": "1234567890",
      "street": "456 Another St",
      "apartment": "1A",
      "zip": "54321",
      "city": "Updated City",
      "country": "Updated Country"
      }
    ```
   ******************************************************

### 10. **Delete User:**
   - **URL** `http://localhost:4000/user/delete/`+ <USER_Id>
   - **Description:** Deletes the specified user.
   - **Method:** DELETE
   - **Example Request Headers** Key: token, Value: <your_jwt_token_here>
   - **Example Response:**
         ```json-
      {
      "message": "User deleted successfully"
      }
    ```
   ******************************************************