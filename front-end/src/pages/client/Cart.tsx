import React, { useEffect } from "react";
import { useGetCartQuery, useUpdateCartMutation } from "../../api/cart";
import { Button, Image, InputNumber } from "antd";
import {
  ICartState,
  loadCart,
  removeProductFromCart,
  updateCartItemQuantity,
} from "../../store/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
const Cart = () => {
  const dispatch = useDispatch();
  const { data: cartData, isSuccess: fetchCartSuccess } = useGetCartQuery();
  const [updateCart] = useUpdateCartMutation();
  const getCart: ICartState = useSelector((state: RootState) => state.carts);
  const authState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (fetchCartSuccess && authState.isLoggedIn) {
      if (cartData.items.length === 0) {
        dispatch(loadCart([]));
      }
      dispatch(loadCart(cartData));
    }
  }, [fetchCartSuccess]);
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
      await dispatch(
        updateCartItemQuantity({ productId, quantity: newQuantity })
      );

      await updateCart({
        items: getCart.items.map((item) => ({
          book: item.book?._id,
          quantity: item.book?._id === productId ? newQuantity : item.quantity,
          price: item.book?.discount,
        })),
      });
    }
  };

  return (
    <main className="w-4/5 mx-auto">
      <div className="flex shadow-md my-5">
        <div className="w-3/4 bg-white px-10 py-5">
          <div className="flex justify-between border-b pb-8">
            <h1 className=" text-2xl">Giỏ hàng</h1>
            <h2 className=" text-2xl">{getCart.items.length} sản phẩm</h2>
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
              key={itemCart.book?._id}
              className="flex items-center relative hover:bg-gray-100 -mx-8 px-6 py-5"
            >
              <div className="flex w-2/5">
                {" "}
                {/* product */}
                <div className="w-1/4">
                  <Image
                    className="h-24 w-full"
                    src={itemCart?.book?.images[0].url}
                  />
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow w-3/4">
                  <span className="font-bold text-sm truncate">
                    {itemCart?.book?.title}
                  </span>
                  {itemCart?.book?.sale > 0 ? (
                    <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
                      {itemCart?.book?.sale}% OFF
                    </span>
                  ) : (
                    ""
                  )}
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
                {itemCart?.book?.price.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-center w-1/5  text-sm">
                {(itemCart?.book?.discount * itemCart.quantity).toLocaleString(
                  "vi-VN"
                )}
                ₫
              </span>
            </div>
          ))}

          <Link
            to={`/products`}
            className="flex  text-indigo-600 text-sm mt-10"
          >
            <svg
              className="fill-current mr-2 text-indigo-600 w-4"
              viewBox="0 0 448 512"
            >
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
        <div id="summary" className="w-1/4 px-8 py-10">
          <div className="flex justify-between mt-10 mb-5">
            <span className=" text-sm uppercase">Tạm tính</span>
            <span className=" text-sm">
              {getCart?.items
                .reduce((acc, item) => {
                  return acc + item.book?.discount * item.quantity;
                }, 0)
                .toLocaleString("vi-VN")}
              ₫
            </span>
          </div>
          {/* <div>
      <label className="font-medium inline-block mb-3 text-sm uppercase">Shipping</label>
      <select className="block p-2 text-gray-600 w-full text-sm">
        <option>Standard shipping - $10.00</option>
      </select>
    </div> */}
          {/* <div className="py-10">
            <label
              htmlFor="promo"
              className=" inline-block mb-3 text-sm uppercase"
            >
              Mã giảm giá
            </label>
            <input
              type="text"
              id="promo"
              placeholder="Enter your code"
              className="p-2 text-sm w-full"
            />
          </div>
          <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase rounded-md font-sans font-bold">
            Áp dụng
          </button> */}
          <div className="border-t mt-8">
            <div className="flex  justify-between py-6 text-sm uppercase">
              <span>Tổng tiền</span>
              <span>
                {getCart?.items
                  .reduce((acc, item) => {
                    return acc + item.book?.discount * item.quantity;
                  }, 0)
                  .toLocaleString("vi-VN")}
                ₫
              </span>
            </div>
            <Link
              to={`/order/checkout`}
              className="bg-indigo-500 btn  hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
