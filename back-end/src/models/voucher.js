import mongoose from "mongoose";

const validVoucherTypes = ["percent", "value", "promotion"];
const validVoucherRoles = ["productDiscount", "userDiscount", "otherRole"];

const voucherSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: validVoucherTypes,
      required: true,
    },
    code: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    discount: {
      type: Number,
      required: true,
    },
    used: {
      type: Number,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    categoryIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    bookIds: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Book",
      },
    ],
    role: {
      type: String,
      enum: validVoucherRoles, 
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Voucher", voucherSchema);
