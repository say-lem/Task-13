# Note-Taking API

## Overview

This API provides core functionality for managing notes including creating, retrieving, and deleting notes. Each note consists of a title, content, and automatically tracked timestamps.

## API Documentation

The API includes interactive documentation using Swagger UI.

  **_Note_** that if you are running the app on your localhost, update the swagger.ts file in the config folder
  with:

  ```javascript
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],

  ```

  in other to has access the swagger ui documentation without getting a cors error.

- **Features**:
  - Browse all available endpoints
  - See request/response schemas
  - Test API calls directly from your browser
  - View detailed parameter information

To access the documentation:
the node is deployed on render and will take 60 second or more to respond on restart

1. Start the application
2. Open your browser
3. Navigate to `https://note-taking-api-hzp3.onrender.com/api-docs`

## API Endpoints

| Method | Endpoint         | Description                                 |
| ------ | ---------------- | ------------------------------------------- |
| GET    | `/api/notes`     | Retrieve all notes (sorted by last updated) |
| GET    | `/api/notes/:id` | Retrieve a specific note by ID              |
| POST   | `/api/notes`     | Create a new note                           |
| DELETE | `/api/notes/:id` | Delete a note by ID                         |

## Note Model

Each note contains:

- `_id`: Unique identifier (auto-generated)
- `title`: Note title (required, max 100 characters)
- `content`: Note content (required)
- `createdAt`: Timestamp of creation (auto-generated)
- `updatedAt`: Timestamp of last update (auto-generated)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/note-taking-api.git
   cd note-taking-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/note-taking-app
   ```

   _Note: Update the MONGO_URI as needed for your environment_

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5001` (or the PORT you specified in .env).

## API Usage Examples

### Get All Notes

```
GET /api/notes
```

Response:

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "notes": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Meeting Notes",
        "content": "Discuss project timeline and resource allocation",
        "createdAt": "2023-06-22T19:10:14.398Z",
        "updatedAt": "2023-06-22T19:10:14.398Z"
      },
      {
        "_id": "60d21b4667d0d8992e610c86",
        "title": "Shopping List",
        "content": "Milk, Eggs, Bread",
        "createdAt": "2023-06-22T18:23:45.993Z",
        "updatedAt": "2023-06-22T18:23:45.993Z"
      }
    ]
  }
}
```

### Get Note by ID

```
GET /api/notes/60d21b4667d0d8992e610c85
```

Response:

```json
{
  "status": "success",
  "data": {
    "note": {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Meeting Notes",
      "content": "Discuss project timeline and resource allocation",
      "createdAt": "2023-06-22T19:10:14.398Z",
      "updatedAt": "2023-06-22T19:10:14.398Z"
    }
  }
}
```

### Create New Note

```
POST /api/notes
Content-Type: application/json

{
  "title": "Task List",
  "content": "Complete API documentation and unit tests"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "note": {
      "_id": "60d21b4667d0d8992e610c87",
      "title": "Task List",
      "content": "Complete API documentation and unit tests",
      "createdAt": "2023-06-23T08:40:21.112Z",
      "updatedAt": "2023-06-23T08:40:21.112Z"
    }
  }
}
```

### Delete Note

```
DELETE /api/notes/60d21b4667d0d8992e610c85
```

Response: Status 204 No Content

## Error Handling

The API provides clear error messages with appropriate HTTP status codes:

- `400 Bad Request`: Invalid input data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server errors

Example error response:

```json
{
  "status": "fail",
  "message": "Note with ID 60d21b4667d0d8992e610c99 not found"
}
```