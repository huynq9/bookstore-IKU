import { Button, Form, Image, Input, InputNumber, Radio, message } from 'antd'
import React from 'react'
import { ICartState, loadCart, removeProductFromCart, updateCartItemQuantity } from '../../store/cart/cartSlice';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useChangeStatusMutation, useCreateOrderMutation, useGetOrderByIdQuery } from '../../api/order';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import { IOrderResponse } from '../../interfaces/order';

const OrderDetail = () => {
  const getCart: ICartState = useSelector((state: RootState) => state.carts)
  const [changeStatus] = useChangeStatusMutation()

  const { id } = useParams()
  const { data: orderData } = useGetOrderByIdQuery(id!)
  console.log(orderData);
  const dispatch = useDispatch()
  const convertedDateTime = moment(orderData?.createdAt).utcOffset('+07:00');
  function handleButtonClick(orderData: IOrderResponse) {
      if(window.confirm('Bạn có chắc muốn hủy')){
        if (orderData.status === 0 || orderData.status === 1) {
          changeStatus({ id: String(orderData._id), newStatus: { newStatus: 2 } })
        }
      }
  }
  return (
    <main className="w-4/5 mx-auto bg-slate-50 rounded-lg  flex">
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
        <div className="flex justify-start item-start space-y-2 flex-col">
          <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Order #{id}</h1>
          <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">{convertedDateTime.format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
            <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
              <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">Chi tiết đơn hàng</p>
              {orderData?.items.map(item => (
                <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
                  <div className="pb-4 md:pb-8 w-full md:w-40">
                    <img className="w-full hidden md:block" src={item.bookId.images[0].url} alt="book" />
                    <img className="w-full md:hidden" src={item.bookId.images[0].url} alt="book" />
                  </div>
                  <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                    <div className="w-full flex flex-col justify-start items-start space-y-8">
                      <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">{item.bookId.title}</h3>
                      {/* <div className="flex justify-start items-start flex-col space-y-2">
                        <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Style: </span> Italic Minimal Design</p>
                        <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Size: </span> Small</p>
                        <p className="text-sm dark:text-white leading-none text-gray-800"><span className="dark:text-gray-400 text-gray-300">Color: </span> Light Blue</p>
                      </div> */}
                    </div>
                    <div className="flex justify-between space-x-8 items-start w-full">
                      <p className="flex text-sm dark:text-white xl:text-md leading-6">{item.price.toLocaleString("vi-VN")}₫    <span className="text-red-300 line-through text-xs">{item?.bookId?.price.toLocaleString("vi-VN")}₫  </span></p>
                      <p className="text-sm dark:text-white xl:text-md leading-6 text-gray-800">{item.quantity}</p>
                      <p className="text-sm dark:text-white xl:text-md font-semibold leading-6 text-gray-800">${(item.quantity * item.price).toLocaleString("vi-VN")}₫</p>
                    </div>
                  </div>
                </div>))}

            </div>
            <div className="flex justify-center flex-col md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
              <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-1/2 bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Tóm tắt</h3>
                <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                  <div className="flex justify-between w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">Tạm tính</p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">{orderData?.totalPrice.toLocaleString("vi-VN")}₫</p>
                  </div>
                  {/* <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">Discount <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">STUDENT</span></p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">-$28.00 (50%)</p>
                  </div> */}
                  {/* <div className="flex justify-between items-center w-full">
                    <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
                    <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$8.00</p>
                  </div> */}
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Tổng tiền</p>
                  <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">{orderData?.totalPrice.toLocaleString("vi-VN")}₫</p>
                </div>
              </div>
              {/* <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
                <div className="flex justify-between items-start w-full">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="w-8 h-8">
                      <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
                    </div>
                    <div className="flex flex-col justify-start items-center">
                      <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">DPD Delivery<br /><span className="font-normal">Delivery with 24 Hours</span></p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">$8.00</p>
                </div>
                <div className="w-full flex justify-center items-center">
                  <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">View Carrier Details</button>
                </div>
              </div> */}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Người nhận</h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col justify-start items-start flex-shrink-0">
                <div className="flex justify-center w-full md:justify-start items-center space-x-4 py-8 border-b border-gray-200">
                  <UserOutlined />
                  <div className="flex justify-start items-start flex-col space-y-2">
                    <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">{orderData?.fullName}</p>
                    <p className="text-sm dark:text-gray-300 leading-5 text-gray-600">{orderData?.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="cursor-pointer text-sm leading-5 ">{orderData?.email}</p>
                </div>
              </div>
              <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Shipping Address</p>
                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{orderData?.shippingAddress}</p>
                  </div>
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Phương thức thanh toán</p>
                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{orderData?.paymentMethod}</p>
                  </div>
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">Trạng thái đơn hàng</p>
                    <p className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">{orderData?.status === 1 ? "Đơn hàng đang được chuẩn bị" : (orderData?.status === 0 ? "Chờ xác nhận" : (orderData?.status === 2 ? "Đơn hàng đã hủy" : (orderData?.status === 3) ? "Đang giao" : "Đơn hàng thất lạc"))}</p>
                  </div>
                </div>
                <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                  <button
                    className="mt-6 md:mt-0 dark:border-white dark:hover:bg-gray-900 dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 border border-gray-800 font-medium w-96 2xl:w-full text-base font-medium leading-4 text-gray-800"
                    onClick={() => handleButtonClick(orderData)}
                  >
                    {orderData?.status === 0 || orderData?.status === 1 ? "Hủy đơn hàng" : "Tiếp tục mua sắm"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}

export default OrderDetail