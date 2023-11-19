import { Button, Form, Image, Input, InputNumber, Radio, Space, Table, Tag, Tooltip, message } from 'antd'
import React from 'react'
import { ICartState, loadCart, removeProductFromCart, updateCartItemQuantity } from '../../store/cart/cartSlice';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCreateOrderMutation, useGetOrderByIdQuery, useGetUserOrdersQuery } from '../../api/order';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { IBook } from '../../interfaces/book';

interface DataType {
  key: string;
  _id: string;
  createdAt: string;
  totalPrice: number;
  items: ItemType[];
  status: number;
}
const OrderList = () => {
  const { data: List, isSuccess } = useGetUserOrdersQuery()
  console.log(List);
  const dispatch = useDispatch()

  const columns: ColumnsType<DataType> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: '_id',
      key: '_id',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <Tooltip placement="topLeft" ><Link to={`/order/${text}`}>#{text}</Link></Tooltip>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'items',
      key: 'items',
      render: items => (
        <div>
          {items.map((item: { _id: string, price: number, bookId: IBook, quantity: number }) => (
            <div className='flex my-1' key={item._id}>
              <img className='w-1/3' src={item.bookId.images[0].url} alt="" />
              <div className='flex flex-col'>
                <p>x {item.quantity}</p>
                <p>{item.price.toLocaleString("vi-VN")}₫</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <>
          {status == 0 ? <Tag color='blue'>Chờ xác nhận</Tag> : (status == 1 ? <Tag color='cyan'>Đóng gói</Tag> : (status == 2 ? <Tag color='red'>Lỗi giao hàng</Tag> :(status == 3?<Tag color='default'>Đang giao</Tag>:<Tag color='green'>Giao thành công</Tag> ) ))}
        </>
      ),
    },
    // {
    //     title: 'Action',
    //     key: 'action',
    //     render: (_, record) => (
    //         <Space size="middle">
    //             <a>Invite</a>
    //             <a>Delete</a>
    //         </Space>
    //     ),
    // },
  ];

  const data: DataType[] = List ? List.map(order => ({
    key: String(order._id),
    _id: String(order._id),
    createdAt: moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    totalPrice: order.totalPrice,
    items: order.items,
    status: order.status,
  })) : [];
  return (
    <main className="w-4/5 mx-auto bg-slate-50 rounded-lg  flex">
      <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto">
        {/*- more free and premium Tailwind CSS components at https://tailwinduikit.com/ -*/}
        <div className="flex justify-start item-start space-y-2 flex-col">
          <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">Danh sách đơn hàng</h1>
        </div>
        <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
          <Table className='w-full' columns={columns} dataSource={data} pagination={{ defaultPageSize: 3, showSizeChanger: true, pageSizeOptions: ['10', '20', '30'] }} />;
        </div>
      </div>

    </main>
  )
}

export default OrderList