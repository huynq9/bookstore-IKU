import mongoose from "mongoose";
import Book from "./book.js";

const categorySchema = new  mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    books:[{
      type: mongoose.Types.ObjectId,
      ref: "Book",
    }],
},
  {
    timestamps: true,
    versionKey: false,
  });

  export default mongoose.model('Category', categorySchema);