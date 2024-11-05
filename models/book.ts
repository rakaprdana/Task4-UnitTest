import mongoose, { Document, Schema, Model } from "mongoose";

// Definisikan tipe IBook
export interface IBook extends Document {
  title: string;
  author: string;
  code: string;
  description?: string; // Sesuaikan dengan schema
}

// Buat schema buku
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String }, // Sesuaikan agar tidak required
  },
  { versionKey: false } // Disable __v property
);

// Ekspor model
const Book: Model<IBook> = mongoose.model<IBook>("Book", bookSchema);
export default Book;
