import { Request, Response } from "express";
import { getAllBooks, addBook } from "../controllers/bookController";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import Book from "../models/book";
import request from "supertest";
import app from "../app";

let mongoServer: MongoMemoryServer;
let cookie: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(uri);
  const loginResponse = await request(app)
    .post("/api/login")
    .send({ username: "admin", password: "password" })
    .expect(200);

  cookie = loginResponse.headers["set-cookie"];
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Book.deleteMany({});
});

describe("Authentication API", () => {
  it("should login successfully with valid credentials", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "admin", password: "password" })
      .expect(200);

    expect(response.body.message).toBe("Login successful");
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});

describe("Book Controller", () => {
  it("should return list of books", async () => {
    const req = {} as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    await getAllBooks(req, res);
    expect(res.json).toHaveBeenCalled();
  }, 10000);

  it("should add a new book", async () => {
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

  it("should get a book by id", async () => {
    const book = new Book({
      title: "Another Sample Book",
      author: "Jane Doe",
      code: "B002",
      description: "Another book for testing",
    });
    await book.save();

    const response = await request(app)
      .get(`/api/books/${book._id}`)
      .expect(200);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(book.title);
    expect(response.body.author).toBe(book.author);
    expect(response.body.code).toBe(book.code);
    expect(response.body.description).toBe(book.description);
  });

  it("should update a book by id", async () => {
    const book = new Book({
      title: "Original Book",
      author: "Author One",
      code: "B0001",
      description: "Original description",
    });
    await book.save();

    const updatedData = {
      title: "Updated Book",
      author: "Updated Author",
      code: "B0002",
      description: "Updated description",
    };

    const response = await request(app)
      .put(`/api/books/${book._id}`)
      .set("Cookie", cookie)
      .send(updatedData)
      .expect(200);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(updatedData.title);
    expect(response.body.author).toBe(updatedData.author);
    expect(response.body.code).toBe(updatedData.code);
    expect(response.body.description).toBe(updatedData.description);

    const updatedBookInDb = await Book.findById(book._id);
    expect(updatedBookInDb).not.toBeNull();
    expect(updatedBookInDb?.title).toBe(updatedData.title);
  });

  it("should delete a book by id", async () => {
    const book = new Book({
      title: "Book to Delete",
      author: "Author Two",
      code: "B0003",
      description: "Description to delete",
    });
    await book.save();

    await request(app)
      .delete(`/api/books/${book._id}`)
      .set("Cookie", cookie)
      .expect(200);

    const deletedBookInDb = await Book.findById(book._id);
    expect(deletedBookInDb).toBeNull();
  });
});
