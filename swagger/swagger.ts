// swagger.ts
const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Book Management API",
    version: "1.0.0",
    description: "API for managing books",
  },
  paths: {
    "/login": {
      post: {
        summary: "User login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successful login",
          },
        },
      },
    },
    "/books": {
      get: {
        summary: "Get all books",
        responses: {
          "200": {
            description: "List of books",
          },
        },
      },
      post: {
        summary: "Add a new book",
        responses: {
          "201": {
            description: "Book added",
          },
        },
      },
    },
    "/books/{id}": {
      get: {
        summary: "Get book by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Book details",
          },
        },
      },
      put: {
        summary: "Update book by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Book updated",
          },
        },
      },
      delete: {
        summary: "Delete book by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "Book deleted",
          },
        },
      },
    },
  },
};

export default swaggerDocument;
