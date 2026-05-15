# API Reference

This document provides a detailed reference for the Cloudbeds Add-on Manager API.

## Authentication

Most API endpoints are protected and require a valid JSON Web Token (JWT) to be passed in the `Authorization` header as a Bearer token.

### Authentication Flow

1.  **Obtain a Token:** Send a `POST` request to `/api/auth/login` with the correct admin password.
2.  **Receive a Token:** The server will respond with a JWT in the response body. This token has a limited lifetime.
3.  **Use the Token:** For all subsequent requests to protected endpoints, include the token in the `Authorization` header.

```
Authorization: Bearer <your_jwt_here>
```

4.  **Logout:** To log out, send a request to `/api/auth/logout`. This will clear the authentication cookie on the server-side.

---

## Endpoints

### Auth

#### `POST /api/auth/login`

Authenticates the user and returns a JWT.

-   **Auth Required:** No
-   **Request Body:**
    | Parameter  | Type   | Description            |
    | :--------- | :----- | :--------------------- |
    | `password` | string | The site admin password. |
-   **Success Response (200):**
    ```json
    {
      "token": "ey..."
    }
    ```
-   **Error Responses:**
    | Code | Message             |
    | :--- | :------------------ |
    | 401  | `Invalid password.` |

#### `GET /api/auth/logout`

Clears the user's session.

-   **Auth Required:** No
-   **Request Body:** None
-   **Success Response (200):**
    ```json
    {
      "message": "Logged out successfully."
    }
    ```

---

### Add-ons

#### `GET /api/addons`

Fetches the list of all add-ons, merged with local overrides from the database. This is a public endpoint.

-   **Auth Required:** No
-   **Query Parameters:**
    | Parameter | Type    | Description                                       |
    | :-------- | :------ | :------------------------------------------------ |
    | `active`  | boolean | If `true`, returns only add-ons marked as active. |
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "12345",
          "order": 1,
          "active": true,
          "item_name": "Late Checkout",
          "addon_name": "Services",
          "charge_type": "per night",
          "max_qty": 1,
          "image_url": "/uploads/12345.png"
        }
      ]
    }
    ```
-   **Error Responses:**
    | Code | Message                                |
    | :--- | :------------------------------------- |
    | 500  | `Failed to fetch items from Cloudbeds` |

#### `PATCH /api/addons/[id]/toggle`

Toggles the `active` status of a specific add-on.

-   **Auth Required:** Yes (JWT)
-   **URL Parameters:**
    | Parameter | Type   | Description                         |
    | :-------- | :----- | :---------------------------------- |
    | `id`      | string | The Cloudbeds `itemID` of the add-on. |
-   **Request Body:** None
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "cloudbeds_item_id": "12345",
        "active": false
      }
    }
    ```
-   **Error Responses:**
    | Code | Message             |
    | :--- | :------------------ |
    | 401  | `Unauthorized`      |
    | 404  | `Item not found`    |
    | 500  | `Failed to update`  |

#### `POST /api/addons/[id]/image`

Uploads or replaces the custom image for an add-on.

-   **Auth Required:** Yes (JWT)
-   **URL Parameters:**
    | Parameter | Type   | Description                         |
    | :-------- | :----- | :---------------------------------- |
    | `id`      | string | The Cloudbeds `itemID` of the add-on. |
-   **Request Body:** `multipart/form-data`
    | Field   | Type | Description              |
    | :------ | :--- | :----------------------- |
    | `image` | File | The image file to upload. |
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "cloudbeds_item_id": "12345",
        "image_url": "/uploads/12345.png"
      }
    }
    ```
-   **Error Responses:**
    | Code | Message                       |
    | :--- | :---------------------------- |
    | 400  | `No image file provided`      |
    | 401  | `Unauthorized`                |
    | 500  | `Image upload failed`         |

#### `DELETE /api/addons/[id]/image`

Removes the custom image for an add-on, reverting to no image.

-   **Auth Required:** Yes (JWT)
-   **URL Parameters:**
    | Parameter | Type   | Description                         |
    | :-------- | :----- | :---------------------------------- |
    | `id`      | string | The Cloudbeds `itemID` of the add-on. |
-   **Request Body:** None
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "data": {
        "cloudbeds_item_id": "12345",
        "image_url": null
      }
    }
    ```
-   **Error Responses:**
    | Code | Message             |
    | :--- | :------------------ |
    | 401  | `Unauthorized`      |
    | 500  | `Image removal failed`|
