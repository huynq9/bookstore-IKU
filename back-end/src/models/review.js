import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Tham chiếu đến model sản phẩm
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Tham chiếu đến model người dùng
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Tạo model cho đánh giá sản phẩm
export default mongoose.model("Review", reviewSchema);
