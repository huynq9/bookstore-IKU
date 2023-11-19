import { Button, Form, Image, Input, InputNumber, Radio, message } from "antd";
import React from "react";
import {
  ICartState,
  loadCart,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../../store/cart/cartSlice";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { useCreateOrderMutation } from "../../api/order";
import { useNavigate } from "react-router-dom";
import { useGetCartQuery, useUpdateCartMutation } from "../../api/cart";

const Checkout = () => {
  const getCart: ICartState = useSelector((state: RootState) => state.carts);
  const { refetch: refetchCart } = useGetCartQuery();
  const authState = useSelector((state: RootState) => state.user);

  const [addOrder] = useCreateOrderMutation();
  const dispatch = useDispatch();
  const [updateCart] = useUpdateCartMutation();
  const navigate = useNavigate();
  const onFinish = (values: any) => {
    const postData = {
      ...values,
      items: getCart.items.map((item) => ({
        bookId: item.book._id,
        quantity: item.quantity,
        price: item.book.discount,
      })),
      totalPrice: getCart.totalMoney,
    };
    addOrder(postData)
      .unwrap()
      .then((data) => {
        message.info("ok");
        refetchCart();
        console.log(data);
        navigate(`/order/${data._id}`);
      });
  };
  const handleRemove = async (id: string) => {
    if (authState.isLoggedIn) {
      dispatch(removeProductFromCart(id));
      await updateCart({
        items: getCart.items
          .filter((item) => item.book._id !== id)
          .map((item) => ({
            book: item.book?._id,
            quantity: item?.quantity,
            price: item.book?.discount,
          })),
      });
    }
  };
  const handleChangeQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (authState.isLoggedIn) {
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity }));
      // Gọi mutation updateCart ở đây nếu cần
      await updateCart({
        items: getCart.items.map((item) => ({
          book: item.book?._id,
          quantity: item?.quantity,
          price: item.book?.discount,
        })),
      });
    }
  };
  return (
    <main className="w-4/5 mx-auto bg-slate-50 rounded-lg  flex">
      <div className="order-info w-1/2 border-r p-8 rounded-lg">
        <h2 className="text-center font-semibold text-2xl pb-8">
          Thông tin vận chuyển
        </h2>
        <Form
          name="basic"
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <div className="flex">
            <Form.Item
              className="w-1/2 mb-0"
              label="Họ và tên"
              name="fullName"
              rules={[
                { required: true, message: "Please input your fullName!" },
              ]}
            >
              <Input className="w-3/4" />
            </Form.Item>

            <Form.Item
              className="w-1/2 mb-0"
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Please input your phoneNumber!" },
              ]}
            >
              <Input className="w-3/4" />
            </Form.Item>
          </div>
          <Form.Item
            className="w-full"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="shippingAddress"
            rules={[
              { required: true, message: "Please input your shippingAddress!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input />
          </Form.Item>
          <Form.Item name="paymentMethod" label="Hình thức thanh toắn">
            <Radio.Group>
              <Radio value="VNBANK">VNPay</Radio>
              <Radio value="COD">COD</Radio>
              <Radio value="MOMO">Ví MOMO</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 30 }} className="">
            <Button
              className="w-5/12 p-3"
              danger
              type="dashed"
              htmlType="submit"
            >
              Thanh toán
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="order-list p-8 w-1/2">
        <div className=" bg-white px-10 py-5">
          <div className="flex justify-between border-b pb-8">
            <h1 className=" text-2xl">Giỏ hàng</h1>
            <h2 className=" text-xl">{getCart.items.length} sản phẩm</h2>
          </div>
          <div className="flex mt-10 mb-5">
            <h3 className=" text-gray-600 text-xs uppercase w-2/5">
              Chi tiết sản phẩm
            </h3>
            <h3 className=" text-center text-gray-600 text-xs uppercase w-1/5 ">
              Số lượng
            </h3>
            <h3 className=" text-center text-gray-600 text-xs uppercase w-1/5">
              Giá
            </h3>
            <h3 className=" text-center text-gray-600 text-xs uppercase w-1/5 ">
              Tổng tiền
            </h3>
          </div>
          {getCart?.items.map((itemCart) => (
            <div
              key={itemCart.book._id}
              className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
            >
              <div className="flex w-2/5">
                {" "}
                {/* product */}
                <div className="w-1/4">
                  <Image
                    className="h-24 w-full"
                    src={itemCart.book.images[0].url}
                  />
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow w-3/4">
                  <span className="font-bold text-sm truncate">
                    {itemCart?.book?.title}
                  </span>
                  <span className="text-red-500 text-xs">Apple</span>
                  <Button
                    onClick={() =>
                      handleRemove(itemCart.book?._id ? itemCart.book?._id : "")
                    }
                    className=" hover:text-red-500 text-gray-500 text-xs w-fit"
                  >
                    Xóa bỏ
                  </Button>
                </div>
              </div>
              <div className="flex justify-center w-1/5">
                <InputNumber
                  formatter={(value) => `${parseInt(value, 10)}`}
                  parser={(value) => parseInt(value, 10)}
                  onChange={async (newQuantity) => {
                    if (Number.isInteger(newQuantity)) {
                      await handleChangeQuantity(
                        itemCart.book?._id ? itemCart.book?._id : "",
                        newQuantity!
                      );
                    }
                  }}
                  min={1}
                  max={itemCart?.book?.stock}
                  className="mx-2 border text-center w-16"
                  type="text"
                  defaultValue={itemCart.quantity}
                />
              </div>
              <span className="text-center w-1/5  text-sm">
                {itemCart.book.discount.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-center w-1/5  text-sm">
                {(itemCart.book.discount * itemCart.quantity).toLocaleString(
                  "vi-VN"
                )}
                ₫
              </span>
            </div>
          ))}

          <a href="#" className="flex  text-indigo-600 text-sm mt-10">
            <svg
              className="fill-current mr-2 text-indigo-600 w-4"
              viewBox="0 0 448 512"
            >
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
