import Book from '../models/book.js';
import Cart from '../models/cart.js';
import Order from '../models/order.js'
import Voucher from '../models/voucher.js';

export const getAll = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.bookId')
        if (!orders) {
            return res.status(404).json({
                message: "Order not found",
            });
        }
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
export const getOrdersByUser = async (req, res)=>{
  try {
    const orders = await Order.find({userId:req.user._id}).populate('items.bookId').sort({ createdAt: -1 });
    return res.status(200).json(orders)
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server Error' });
  }
}
export const getOrder = async (req, res) => {
    
    try {
        const orderId = req.params.id; // Lấy orderId từ đường dẫn
        const order = await Order.findById(orderId).populate(
            'items.bookId'
          );
  
      if (!order) {
        return res.status(404).json({ error: "Không tìm thấy đơn đặt hàng" });
      }
  
      // Giờ đây, biến `order` chứa thông tin về đơn đặt hàng cùng với thông tin sách.
  
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi lấy thông tin đơn đặt hàng" });
    }
  };
  export const createOrder = async (req, res) => {
    try {
      const userId = req.user._id
      const {
        username,
        email,
        phoneNumber,
        items,
        totalPrice,
        discountCode,
        shippingAddress,
        paymentMethod,
        note,
        fullName
      } = req.body;
      let itemsPrice = 0;

      // Kiểm tra xem có sách nào không tồn tại hoặc số lượng đặt hàng không hợp lệ
      for (const item of items) {
        const existingBook = await Book.findById(item.bookId);
        if (!existingBook) {
          return res.status(400).json({ error: "Sách không tồn tại" });
        }
        if (item.quantity <= 0) {
          return res.status(400).json({ error: "Số lượng đặt hàng không hợp lệ" });
        }
        itemsPrice += existingBook.discount* item.quantity
        console.log(itemsPrice);
      }
      if (discountCode) {
        const validDiscountCode = await Voucher.findOne({code:discountCode});
        if (!validDiscountCode || validDiscountCode.role !== "userDiscount") {
            return res.status(400).json({ error: "Mã giảm giá không hợp lệ" });
         }else{
            if (validDiscountCode.type === "value") {
                itemsPrice -= validDiscountCode.discount; // Giảm giá cố định
              } else if (validDiscountCode.type === "percent") {
                itemsPrice -= (itemsPrice * (validDiscountCode.discount / 100)).toFixed(); // Giảm giá theo phần trăm
              }
        }
      }
      const epsilon = 0.01; 
      if (Math.abs(totalPrice - itemsPrice) > epsilon) {
        console.log(totalPrice, ` ${itemsPrice}`);
        return res.status(400).json({
          message: "Sai gia"
        });
      }
  
      const order = await Order.create({
        userId,
        username,
        email,
        phoneNumber,
        items,
        totalPrice,
        discountCode,
        shippingAddress,
        paymentMethod,
        note,
        fullName
      });
      await Cart.findOneAndDelete({ userId });

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ err: "Không thể tạo đơn đặt hàng: ", error });
    }
  };
  export const cancelOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: "Đơn đặt hàng không tồn tại" });
      }
  
      // Kiểm tra xem đơn đặt hàng đã được hủy chưa
      if (order.status === 0) {
        return res.status(400).json({ error: "Đơn đặt hàng đã bị hủy" });
      }
  
      // Đánh dấu đơn đặt hàng là đã hủy (hoặc xóa nếu muốn)
      order.status = 0;
      await order.save();
  
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: "Không thể hủy đơn đặt hàng" });
    }
  };
  export const updateOrder = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const updates = req.body; // Dữ liệu cần cập nhật
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ error: "Đơn đặt hàng không tồn tại" });
      }
  
      // Kiểm tra và cập nhật thông tin đơn đặt hàng
      if (updates.items) {
        let itemsPrice = 0;
  
        for (const item of updates.items) {
          const existingBook = await Book.findById(item.bookId);
          if (!existingBook) {
            return res.status(400).json({ error: "Sách không tồn tại" });
          }
  
          if (item.quantity <= 0) {
            return res.status(400).json({ error: "Số lượng đặt hàng không hợp lệ" });
          }
  
          // Lấy giá của sản phẩm và tính giá tạm thời cho sản phẩm này
          const productPrice = existingBook.discount;
          itemsPrice += productPrice * item.quantity;
        }
  
        // Cập nhật tổng giá trong `updates` với giá sản phẩm sau cập nhật
        updates.totalPrice = itemsPrice;
      }
  
      // Cập nhật đơn đặt hàng
      await order.updateOne(updates);
  
      res.status(200).json(order);
    } catch (error) {
      res.status(400).json({ error: "Không thể cập nhật đơn đặt hàng" });
    }
  };

  export const changeShippingAddress = async (req, res) => {
    const { orderId } = req.params;
    const { newShippingAddress } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      if (order.status === 0 || order.status === 1) {
        order.shippingAddress = newShippingAddress;
        await order.save();
  
        return res.status(200).json({ success: true, message: 'Shipping address updated successfully' });
      } else {
        return res.status(400).json({ error: 'Cannot change shipping address for orders with status other than 0 or 1' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  export const changeOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { newStatus } = req.body;
  
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      order.status = newStatus;
      await order.save();
  
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export const deleteOrder = async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
            });
        }

        await Order.findByIdAndDelete(orderId);

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
        });
    }
};
  
  
  