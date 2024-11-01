import { Request, Response, NextFunction } from "express";
import Book from "../models/book";

// Tambah buku baru ke MongoDB
export const addBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, author, code, description } = req.body;
    const newBook = new Book({ title, author, code, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error: any) {
    res.status(400).json({ message: error });
  }
};

// Mendapatkan semua buku dari MongoDB
export const getAllBooks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books: ", error });
  }
};

// Mendapatkan buku berdasarkan ID
export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
  }
};

// Memperbarui buku berdasarkan ID
export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, author, code, description } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, code, description },
      { new: true }
    );
    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

// Menghapus buku berdasarkan ID
export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};
