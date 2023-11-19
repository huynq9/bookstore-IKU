import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { changePasswordSchema, signinSchema, signupSchema } from "../validations/auth.js";
dotenv.config();

const { SECRET_CODE } = process.env;

export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json({
        messages: "Email đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Kiểm tra nếu req.body.remember là true thì đặt thời hạn của token là 30 ngày, ngược lại là 1 ngày.
    const expiresIn = req.body.remember ? "30d" : "1d";

    const token = jwt.sign({ id: user._id }, SECRET_CODE, { expiresIn });

    user.password = undefined;
    return res.status(201).json({
      message: "success",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server!",
      error: error
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        messages: errors,
      });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        messages: "Email không tồn tại",
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        messages: "Sai mật khẩu",
      });
    }
    const expiresIn = req.body.remember ? "7d" : "1d";

    const token = jwt.sign({ id: user._id }, SECRET_CODE, { expiresIn });

    user.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken: token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server!",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    // Sử dụng schema Joi để xác thực dữ liệu cập nhật
    const { error, value } = userInfoSchema.validate(userData);

    if (error) {
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map((err) => err.message),
      });
    }

    const user = await User.findByIdAndUpdate(userId, value, { new: true });

    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy người dùng để cập nhật',
      });
    }

    user.password = undefined; // Loại bỏ trường mật khẩu trước khi trả về dữ liệu

    return res.status(200).json({
      message: 'Cập nhật thông tin người dùng thành công',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Lỗi server',
      error: error,
    });
  }
};
export const getAllUsersAsAdmin = async (req, res) => {
  try {
    const requestingUser = req.user; // Đảm bảo bạn đã thiết lập thông tin người dùng trong middleware xác thực

    if (requestingUser.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    // Lấy danh sách tất cả người dùng từ cơ sở dữ liệu, bao gồm mật khẩu
    const users = await User.find();

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "Không có người dùng nào trong hệ thống" });
    }

    return res.status(200).json( users
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; 

    const requestingUser = req.user;
    if (
      requestingUser.role !== "admin" &&
      requestingUser._id.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa người dùng này" });
    }

    // Xóa người dùng dựa trên ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.status(200).json({ message: "Người dùng đã được xóa" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};


export const deleteUserPermanently = async (req, res) => {
  try {
    const userId = req.params.id; 

    const requestingUser = req.user;
    if (requestingUser.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa vĩnh viễn người dùng này" });
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res
      .status(200)
      .json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map((err) => err.message),
      });
    }

    const { oldPassword, newPassword } = value;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};


