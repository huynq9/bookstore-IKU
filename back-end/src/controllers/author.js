import Author from "../models/author.js"; // Import model của tác giả
import { authorSchema } from "../validations/author.js"; // Import schema kiểm tra dữ liệu cho tác giả

export const getAuthors = async (req, res) => {
    try {
        const authors = await Author.find();
        if (authors.length === 0) {
            return res.status(400).json({
                message: "Không tìm thấy tác giả!",
            });
        }

        return res.status(200).json(authors);
    } catch (err) {
        return res.status(500).json({
            message: 'Lỗi server!',
            error: err,
        });
    }
};

export const getAuthor = async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({
                message: "Không tìm thấy tác giả!",
            });
        }
        return res.status(200).json({
            message: "Tìm tác giả thành công",
            data: author,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Lỗi server!',
            error: err.message,
        });
    }
};

export const createAuthor = async (req, res) => {
    try {
        const { error } = authorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const author = await Author.create(req.body);
        if (!author) {
            return res.status(400).json({
                message: "Thêm tác giả không thành công!",
            });
        }

        return res.status(200).json({
            message: 'Thêm tác giả thành công',
            data: author,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const removeAuthor = async (req, res) => {
    try {
        const author = await Author.findByIdAndRemove(req.params.id);
        if (!author) {
            return res.status(400).json({
                message: "Xóa tác giả không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Xóa tác giả thành công',
            data: author,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const updateAuthor = async (req, res) => {
    try {
        const { error } = authorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
            });
        }

        const updateData = { ...req.body, updatedAt: new Date() };
        const author = await Author.findByIdAndUpdate(req.params.id, updateData);
        if (!author) {
            return res.status(400).json({
                message: "Sửa tác giả không thành công!",
            });
        }
        return res.status(200).json({
            message: 'Sửa tác giả thành công',
            data: author,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};

export const deleteAuthors = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length === 0) {
            return res.status(400).json({
                message: "Không có tác giả nào để xóa.",
            });
        }

        const deleteAuthors = await Author.deleteMany({ _id: { $in: ids } });

        if (deleteAuthors.deletedCount === 0) {
            return res.status(400).json({
                message: "Xóa không thành công!",
            });
        }

        return res.status(200).json({
            message: 'Xóa tác giả thành công',
            data: deleteAuthors,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Lỗi server',
            error,
        });
    }
};