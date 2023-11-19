import Book from "../models/book";
import Cart from "../models/cart";

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.book");

    if (!cart) {
      const newCart = new Cart({
        userId: userId,
        items: [],
        totalMoney: 0,
      });

      await newCart.save();

      const updatedCart = await Cart.findOne({ userId }).populate("items.book");

      return res.status(200).json(updatedCart);
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: "Không thể lấy giỏ hàng" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bookId, quantity, price } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.stock < quantity) {
      return res.status(400).json({ error: "Số lượng sách không đủ" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = await Cart.create({
        userId,
        items: [{ book: bookId, quantity: quantity, price: price }],
        totalMoney: quantity * price,
      });
      book.stock -= quantity;
      await book.save();
      res.status(200).json(newCart);
    } else {
      const existingItem = cart.items.findIndex(
        (item) => String(item.book) === bookId
      );
      if (existingItem !== -1) {
        cart.items[existingItem].quantity += quantity;
      } else {
        cart.items.push({ book: bookId, quantity: quantity, price: price });
      }
      const newTotalMoney = await calculateTotalMoney(cart.items);
      cart.totalMoney = newTotalMoney;
      await cart.save();
      book.stock -= quantity;
      await book.save();
      res.status(200).json(cart);
    }
  } catch (error) {
    res
      .status(400)
      .json({ error: "Không thể thêm sản phẩm vào giỏ hàng", err: error });
  }
};
const calculateTotalMoney = async (items) => {
  let totalMoney = 0;
  for (const item of items) {
    const product = await Book.findById(item.book);
    if (product) {
      totalMoney += product.discount * item.quantity;
    } else console.log("errr");
  }
  return totalMoney;
};
export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;
    console.log(items);
    let newTotalMoney = 0;
    let updatedCart;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Giỏ hàng không tồn tại" , cart});
    }
    const oldItems = cart.items;

    if (items.length === 0) {
      for (const oldItem of oldItems) {
        const { book: bookId, quantity: oldQuantity } = oldItem;

        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(400).json({ error: "Sản phẩm không tồn tại" });
        }
        book.stock += oldQuantity;
        await book.save();
      }
      newTotalMoney = 0;
      updatedCart = await Cart.findOneAndUpdate(
        { userId }, 
        {
          $set: { totalMoney: newTotalMoney, items:[], userId:userId },
          // $pull: { items: { $exists: true } },
        },
        { new: true }
      );
      return res.status(200).json(updatedCart);
    }

    for (const newItem of items) {
      const { book: bookId, quantity: newQuantity } = newItem;

      // Tìm mục tương ứng trong oldItems
      const oldItem = oldItems.find((item) => String(item.book) === bookId);
      if (!oldItem) {
        return res
          .status(400)
          .json({ error: "Mục không tồn tại trong giỏ hàng cũ" });
      }

      const { quantity: oldQuantity } = oldItem;

      // Kiểm tra sự chênh lệch giữa newQuantity và oldQuantity
      const quantityDiff = newQuantity - oldQuantity;

      if (quantityDiff !== 0) {
        // Trừ hoặc cộng stock của Book tùy thuộc vào hướng của chênh lệch
        const book = await Book.findById(bookId);
        if (!book) {
          return res.status(400).json({ error: "Sản phẩm không tồn tại" });
        }

        book.stock -= quantityDiff;
        await book.save();
      }
    }

    newTotalMoney = await calculateTotalMoney(items);
    updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: items, totalMoney: newTotalMoney } },
      { new: true }
    );

    return res.status(200).json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: "Không thể thêm sản phẩm vào giỏ hàng" });
  }
};

