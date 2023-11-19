import Book from "../models/book.js";
import Voucher from "../models/voucher.js";
import { voucherValidationSchema } from "../validations/voucher.js";

export const getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find();
    if (vouchers.length === 0) {
      return res.status(400).json({
        message: "Không tìm thấy voucher!",
      });
    }

    return res.status(200).json(vouchers);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: err,
    });
  }
};

export const getVoucherById = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.id)
      .populate("categoryIds")
      .populate("bookIds");
    if (!voucher) {
      return res.status(404).json({
        message: "Không tìm thấy voucher!",
      });
    }
    return res.status(200).json(
     voucher,
    );
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: err.message,
    });
  }
};

export const create = async (req, res) => {
  try {
    const { error } = voucherValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const voucher = await Voucher.create(req.body);
    if (!voucher) {
      return res.status(400).json({
        message: "Thêm voucher không thành công!",
      });
    }
    if (voucher.role === "productDiscount" && voucher.categoryIds.length > 0) {
      // Lấy danh sách sản phẩm thuộc danh mục được chọn
      const books = await Book.find({
        categoryId: { $in: voucher.categoryIds },
      });

      // Cập nhật giảm giá cho các sản phẩm tùy theo loại voucher
      if (voucher.type === "value") {
        // Loại voucher "value" giảm giá theo một giá trị cố định
        const discountAmount = voucher.discount;
        for (const book of books) {
          // Tính giảm giá cho sản phẩm
          const discountedPrice = book.price - discountAmount;
          if (discountedPrice < 0) {
            book.price = 0; // Đảm bảo giá không âm
          } else {
            book.discount = discountedPrice;
          }

          // Lưu sản phẩm sau khi cập nhật
          await book.save();
        }
      } else if (voucher.type === "percent") {
        // Loại voucher "percent" giảm giá theo phần trăm
        const discountPercentage = voucher.discount / 100;
        for (const book of books) {
          // Tính giảm giá cho sản phẩm dựa trên phần trăm
          book.discount = book.price * (1 - discountPercentage);

          // Lưu sản phẩm sau khi cập nhật
          await book.save();
        }
      }
    }
    if (voucher.role === "productDiscount" && voucher.bookIds.length > 0) {
      // Nếu có danh sách sách được chọn trong voucher, thực hiện xử lý tương tự
      const books = await Book.find({ _id: { $in: voucher.bookIds } });

      // Áp dụng giảm giá tùy theo loại voucher cho danh sách sách được chọn
      if (voucher.type === "value") {
        // Xử lý giảm giá theo giá trị cố định
        // Loại voucher "value" giảm giá theo một giá trị cố định
        const discountAmount = voucher.discount;
        for (const book of books) {
          // Tính giảm giá cho sản phẩm
          const discountedPrice = book.price - discountAmount;
          if (discountedPrice < 0) {
            book.price = 0; // Đảm bảo giá không âm
          } else {
            book.discount = discountedPrice;
          }

          // Lưu sản phẩm sau khi cập nhật
          await book.save();
        }
      } else if (voucher.type === "percent") {
        // Xử lý giảm giá theo phần trăm
        // Loại voucher "percent" giảm giá theo phần trăm
        const discountPercentage = voucher.discount / 100;
        for (const book of books) {
          // Tính giảm giá cho sản phẩm dựa trên phần trăm
          book.discount = book.price * (1 - discountPercentage);

          // Lưu sản phẩm sau khi cập nhật
          await book.save();
        }
      }
    }

    return res.status(200).json({
      message: "Thêm voucher thành công",
      data: voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndRemove(req.params.id);
    if (!voucher) {
      return res.status(400).json({
        message: "Xóa voucher không thành công!",
      });
    }

    // Lấy danh sách sản phẩm và danh mục dựa trên bookIds và categoryIds
    if (voucher.role === "productDiscount") {
      let booksToUpdate = [];

      if (voucher.bookIds && voucher.bookIds.length > 0) {
        booksToUpdate = await Book.find({ _id: { $in: voucher.bookIds } });
      }

      if (voucher.categoryIds && voucher.categoryIds.length > 0) {
        const categoryBooks = await Book.find({
          categoryId: { $in: voucher.categoryIds },
        });
        booksToUpdate = [...booksToUpdate, ...categoryBooks];
      }

      // Cập nhật trường discount của book về giá trị bằng với price của book
      for (const book of booksToUpdate) {
        book.discount = book.price;
        await book.save();
      }
    }

    return res.status(200).json({
      message: "Xóa voucher thành công",
      data: voucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const voucherId = req.params.voucherId; // Lấy voucherId từ request
    const updatedVoucherData = req.body;

    // Kiểm tra xem voucher có tồn tại không
    const existingVoucher = await Voucher.findById(voucherId);

    if (!existingVoucher) {
      return res.status(404).json({
        message: "Voucher không tồn tại",
      });
    }
    // Validate updated voucher data
    const { error } = voucherValidationSchema.validate(updatedVoucherData);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Lấy danh sách sản phẩm và danh mục dựa trên bookIds và categoryIds
    if (updatedVoucherData.role === "productDiscount") {
      let booksToUpdate = [];
      console.log(1);

      if (updatedVoucherData.bookIds && updatedVoucherData.bookIds.length > 0) {
        booksToUpdate = await Book.find({
          _id: { $in: updatedVoucherData.bookIds },
        });
      }

      if (
        updatedVoucherData.categoryIds &&
        updatedVoucherData.categoryIds.length > 0
      ) {
        const categoryBooks = await Book.find({
          categoryId: { $in: updatedVoucherData.categoryIds },
        });
        booksToUpdate = [...booksToUpdate, ...categoryBooks];
        console.log(booksToUpdate);
      }

      // Cập nhật giá trực tiếp
      if (updatedVoucherData.type === "value") {
        const discountAmount = updatedVoucherData.discount;
        for (const book of booksToUpdate) {
          const discountedPrice = book.price - discountAmount;
          book.discount = discountedPrice < 0 ? 0 : discountedPrice;
          await book.save();
        }
      } else if (updatedVoucherData.type === "percent") {
        const discountPercentage = updatedVoucherData.discount / 100;
        for (const book of booksToUpdate) {
          const discountedPrice = book.price * (1 - discountPercentage);
          book.discount = discountedPrice < 0 ? 0 : discountedPrice;
          await book.save();
        }
      }
    }

    // Cập nhật voucher sau khi cập nhật giá
    const updatedVoucher = await Voucher.findByIdAndUpdate(
      voucherId,
      updatedVoucherData,
      { new: true }
    );

    return res.status(200).json({
      message: "Cập nhật voucher thành công",
      data: updatedVoucher,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};

export const deleteVouchers = async (req, res) => {
  try {
    const voucherIds = req.body.ids; // Lấy danh sách IDs từ req.body

    // Xóa danh sách voucher dựa trên danh sách IDs
    const deletedVouchers = await Voucher.deleteMany({
      _id: { $in: voucherIds },
    });

    // Kiểm tra xem có voucher nào bị xóa không
    if (deletedVouchers.deletedCount === 0) {
      return res.status(400).json({
        message: "Xóa voucher không thành công!",
      });
    }

    // Lấy danh sách sản phẩm và danh mục dựa trên bookIds và categoryIds của các voucher bị xóa
    const booksToUpdate = [];
    for (const voucherId of voucherIds) {
      const voucher = await Voucher.findById(voucherId);
      if (voucher && voucher.role === "productDiscount") {
        if (voucher.bookIds && voucher.bookIds.length > 0) {
          const books = await Book.find({ _id: { $in: voucher.bookIds } });
          booksToUpdate.push(...books);
        }
        if (voucher.categoryIds && voucher.categoryIds.length > 0) {
          const categoryBooks = await Book.find({
            categoryId: { $in: voucher.categoryIds },
          });
          booksToUpdate.push(...categoryBooks);
        }
      }
    }

    // Cập nhật trường discount của các sách về giá trị ban đầu
    for (const book of booksToUpdate) {
      book.discount = book.price;
      await book.save();
    }

    return res.status(200).json({
      message: "Xóa voucher thành công",
      data: deletedVouchers,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};
