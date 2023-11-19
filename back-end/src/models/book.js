import mongoose from "mongoose";

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
        },
        publicId: {
          type: String,
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
      require: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },

    rating: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.pre("save", function (next) {
  //discout sẽ bằng số tiền nhân với sale
  if (typeof this.discount !== "number" || isNaN(this.discount)) {
    if (this.sale === 0) {
      this.discount = this.price;
    } else {
      this.discount = (this.price / 100) * this.sale;
    }
  }
  next();
});

export default mongoose.model("Book", bookSchema);
