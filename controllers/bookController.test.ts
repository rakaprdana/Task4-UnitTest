import { Request, Response } from "express";
import {
  getAllBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController";
import { connectDB } from "../config/db";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Book Controller", () => {
  test("should return list of books", async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await getAllBooks(req, res);

    expect(res.json).toHaveBeenCalled();
  }, 10000);

  test("should add a new book", async () => {
    const req = {
      body: {
        title: "New Book",
        author: "Author Name",
        code: "B0001",
        description: "test",
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await addBook(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "New Book" })
    );
  }, 10000);

  test("should return a book by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getBookById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  }, 10000);

  test("should update a book by ID", async () => {
    const req = {
      params: { id: "1" },
      body: {
        title: "Updated Book Title",
      },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await updateBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Updated Book Title" })
    );
  }, 10000);

  test("should delete a book by ID", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await deleteBook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Book deleted successfully" })
    );
  }, 10000);
});
