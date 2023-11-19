import mongoose from "mongoose";
import Category from "./category.js";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    authorId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Author",
      },
    ],
    categoryId: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    images: [
      {
        url: {
          type: String,
          // required: true
        },
        publicId: {
          type: String,
          // required: true
        },
      },
    ],
    price: {
      type: Number,
      require: true,
    },
    discount: {
      type: Number,
      require: true,
    },
    stock: {
      type: Number,
      require: true,
    },
    publishedAt: {
      type: Date,
      require: true,
    },
    soldCount: {
      type: Number,
      default: 0,
      require: true
    },
    rating:{
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.pre("save", function (next) {
  // Kiểm tra nếu trường `discount` chưa được thiết lập hoặc là null, hãy thiết lập nó bằng trường `price`
  if (typeof this.discount !== "number" || isNaN(this.discount)) {
    this.discount = this.price;
  }
  next();
});

export default mongoose.model("Book", bookSchema);
