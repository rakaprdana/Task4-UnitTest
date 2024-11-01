import mongoose, { Document, Schema, Model } from "mongoose";

interface IBook extends Document {
  title: string;
  author: string;
  code: string;
  description?: string;
}

const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, required: true },
  },
  { versionKey: false } // Disable __v property
);

const Book: Model<IBook> = mongoose.model<IBook>("Book", bookSchema);
export default Book;
