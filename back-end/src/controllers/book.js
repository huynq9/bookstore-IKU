import Book from "../models/book.js";
import { bookSchema } from "../validations/book.js";
import Category from "../models/category.js";
import Author from "../models/author.js";
import mongoose, { isValidObjectId } from "mongoose";

export const getBooks = async (req, res) => {
  try {
    const productsWithReviews = await Book.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "authorId",
        },
      },
    ]);

    if (productsWithReviews.length === 0) {
      return res.status(200).json({
        data: [""],
      });
    }

    return res.status(200).json(productsWithReviews);
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: err,
    });
  }
};
export const getTopSellingBooks = async (req, res) => {
  try {
    console.log(1);
    const topSellingBooks = await Book.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryId",
        },
      },
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "authorId",
        },
      },
      {
        $sort: { soldCount: -1 }, 
      },
      {
        $limit: 10, 
      },
    ]);

    if (topSellingBooks.length === 0) {
      return res.status(200).json({
        data: [],
      });
    }

    return res.status(200).json(topSellingBooks);
  } catch (err) {
    console.log(1);
    return res.status(500).json({
      message: "Lỗi server!ok",
      error: err,
    });
  }
};
export const getBook = async (req, res) => {
  try {
    const bookId =req.params.id
    console.log(bookId);
    const books = await Book.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$_id', { $toObjectId: bookId }],
          },
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'productId',
          as: 'reviews',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryId',
        },
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorId',
        },
      },
      {
        $addFields: {
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);
    if (!books) {
      return res.status(400).json({
        message: "khong tim thay san pham !",
      });
    }
    return res.status(200).json(
       books[0],
    );
  } catch (err) {
    return res.status(500).json({
      message: "loi server!ok",
      error: err,
    });
  }
};

export const getBooksByAuthor = async (req, res) => {
  try {
    const authorId = req.params.authorId;

    const booksWithReviews = await Book.aggregate([
      { $match: { authorId: (authorId) } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
    ]);

    if (booksWithReviews.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy cuốn sách của tác giả!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách cuốn sách của tác giả thành công",
      data: booksWithReviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: err.message,
    });
  }
};

export const getRelatedBooks = async (req, res) => {
  try {
    const bookId = req.params.id;

    const currentBook = await Book.findById(bookId);

    if (currentBook) {
      const relatedBooks = await Book.aggregate([
        {
          $match: {
            _id: { $ne: bookId },
            categoryId: { $in: currentBook.categoryId },
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "productId",
            as: "reviews",
          },
        },
        {
          $addFields: {
            averageRating: { $avg: "$reviews.rating" },
          },
        },
      ]).limit(6);

      const filteredRelatedBooks = relatedBooks.filter((book) => book._id.toString() !== bookId);

      res.status(200).json({
        message: "Lấy danh sách sách liên quan thành công",
        data: filteredRelatedBooks ,
      });
    } else {
      res.status(404).json({
        message: "Không tìm thấy cuốn sách",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getBooksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const booksWithReviews = await Book.aggregate([
      { $match: { categoryId: (categoryId) } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "productId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" },
        },
      },
    ]);

    if (booksWithReviews.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy cuốn sách trong danh mục này!",
      });
    }

    return res.status(200).json({
      message: "Lấy danh sách cuốn sách theo danh mục thành công",
      data: booksWithReviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Lỗi server!",
      error: err.message,
    });
  }
};


export const create = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const bookData = req.body;
    const authorNames = bookData.authorName;
    const authorIds = [];

    // Create an array to store category IDs
    const categoryIds = [];

    for (const authorName of authorNames) {
      let authorId;
      if (isValidObjectId(authorName)) {
        authorId = authorName;
      } else {
        const existingAuthor = await Author.findOne({ name: authorName });
        if (existingAuthor) {
          authorId = existingAuthor._id;
        } else {
          const newAuthor = await Author.create({
            name: authorName,
          });
          authorId = newAuthor._id;
        }
      }
      authorIds.push(authorId);
    }

    bookData.authorId = authorIds;

    if (!Array.isArray(bookData.categoryId))
      bookData.categoryId = [bookData.categoryId];

    const newBook = await Book.create(bookData);

    if (!newBook) {
      return res.status(400).json({
        message: "Thêm sách không thành công!",
      });
    }

    for (const categoryId of bookData.categoryId) {
      const category = await Category.findById(categoryId);
      if (category) {
        category.books.push(newBook._id);
        await category.save();
      }
    }

    return res.status(200).json(newBook);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const book = await Book.findByIdAndRemove(req.params.id);
    if (!book) {
      return res.status(400).json({
        message: "xoa khong thanh cong!",
      });
    }
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: "loi server",
      error,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    
    const bookData = req.body;
    const authorNames = bookData.authorName;
    const authorIds = [];

    for (const authorName of authorNames) {
      let authorId;
      if (isValidObjectId(authorName)) {
        authorId = authorName;
      } else {
        const existingAuthor = await Author.findOne({ name: authorName });
        if (existingAuthor) {
          authorId = existingAuthor._id;
        } else {
          const newAuthor = await Author.create({
            name: authorName,
          });
          authorId = newAuthor._id;
        }
      }

      if (authorId) {
        authorIds.push(authorId);
      }
    }

    bookData.authorId = authorIds;
    bookData.updateAt = new Date();

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });

    if (!updatedBook) {
      return res.status(404).json({
        message: "Không tìm thấy sách để cập nhật!",
      });
    }

    // Lấy danh mục mới từ dữ liệu đầu vào
    const newCategories = bookData.categoryId;

    // Tìm danh mục cũ của sách
    const oldCategories = await Category.find({ books: req.params.id });

    // Cập nhật danh mục cho sách trong bộ sưu tập Category
    for (const oldCategory of oldCategories) {
      if (!newCategories.includes(oldCategory._id.toString())) {
        // Xóa ID sách ra khỏi danh sách sách trong danh mục cũ
        oldCategory.books = oldCategory.books.filter(bookId => bookId.toString() !== req.params.id);
        await oldCategory.save();
      }
    }

    for (const newCategory of newCategories) {
      if (!oldCategories.find(oldCategory => oldCategory._id.toString() === newCategory)) {
        // Thêm ID sách vào danh sách sách trong danh mục mới
        const category = await Category.findById(newCategory);
        if (category) {
          category.books.push(req.params.id);
          await category.save();
        }
      }
    }

    return res.status(200).json(updatedBook);
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};
export const deleteBooks = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm nào để xóa.",
      });
    }

    const deletedBooks = await Book.deleteMany({ _id: { $in: ids } });

    if (deletedBooks.deletedCount === 0) {
      return res.status(400).json({
        message: "Xóa không thành công!",
      });
    }

    return res.status(200).json({
      message: "Xóa thành công",
      data: deletedBooks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server",
      error,
    });
  }
};
