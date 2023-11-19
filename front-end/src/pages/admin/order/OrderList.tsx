import {
    Space,
    Table,
    Spin,
    Button,
    Popconfirm,
    notification,
    Select,
    Input
} from 'antd';
import {
    SearchOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { ColumnsType, TableProps } from 'antd/es/table';
import { useChangeStatusMutation, useDeleteOrderMutation, useGetAllOrdersQuery } from '../../../api/order';
import { useDispatch } from 'react-redux';
import { IOrderResponse } from '../../../interfaces/order';
import { NotificationPlacement } from 'antd/es/notification/interface';
import React, { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';


interface DataType {
    _id: string
    key: React.Key;
    createdAt: string;
    fullName: string;
    status: number;
    paymentMethod: string;
    totalPrice: number;
    paymentStatus: number;
}

const Context = React.createContext({ name: 'Xóa' });
const optionsSearch = [{
    value: 'fullName',
    label: 'Tên khách hàng',
  },
  {
    value: '_id',
    label: 'OrderId',
  },
  {
    value: 'all',
    label: 'Hiển thị tất cả',
  },
]
const OrderManagementPage = () => {
    const [searchText, setSearchText] = useState('')
    const [searchFilter, setSearchFilter] = useState('')
    const dispatch = useDispatch()
    const { data: orders, isLoading, isError } = useGetAllOrdersQuery()
    const [onRemove, { isLoading: isRemoveLoading }]  = useDeleteOrderMutation()
    const [changeStatus] = useChangeStatusMutation()
  const [api] = notification.useNotification();


    const openNotification = (placement: NotificationPlacement, titleProduct?: string) => {
        api.success({
          message: `Thông báo`,
          description: <Context.Consumer>{({ name }) => `${name} thành công ${titleProduct}!`}</Context.Consumer>,
          placement,
        });
      };
    if (isError) {
        return <>error</>;
    }
    if (isLoading) {
        return <>
            <div className="flex justify-center items-center h-[600px]">
                <Spin size='large' />
            </div>
        </>;
    }
    const confirm = (id: string) => {
        onRemove(id).unwrap().then((data) => {
          openNotification('topRight', data?._id)
        })
      }
      const filterData = (orders: IOrderResponse[]) => {
        let filteredData = Array.isArray(orders) ? orders : [];
    
        if (searchFilter === 'fullName') {
          // Lọc dựa trên tên
          filteredData = filteredData.filter((item) => item.fullName.toLowerCase().includes(searchText.toLowerCase())
          );
        } else if (searchFilter === '_id') {
          // Lọc dựa trên id
          filteredData = filteredData.filter((item) => item._id?.toLowerCase().includes(searchText.toLowerCase()));
        } 
    
        return filteredData;
      };
    const columns: ColumnsType<DataType> = [
        {
            title: 'Mã đơn',
            key: 'key',
            ellipsis: {
                showTitle: false,
            },
            render: (record: DataType) => (<Link to={`#`} className='uppercase'>#{record?._id}</Link>),
            className: 'w-1/6',
        },
        {
            title: 'NGÀY ĐẶT',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => {
                // Chuyển đổi giá trị date thành kiểu Date
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);

                // Lấy ngày, tháng, năm từ đối tượng Date
                const dayA = dateA.getDate();
                const monthA = dateA.getMonth() + 1; // Months are zero-based
                const yearA = dateA.getFullYear();

                const dayB = dateB.getDate();
                const monthB = dateB.getMonth() + 1;
                const yearB = dateB.getFullYear();

                // So sánh theo ngày/tháng/năm
                if (yearA === yearB) {
                    if (monthA === monthB) {
                        return dayA - dayB;
                    } else {
                        return monthA - monthB;
                    }
                } else {
                    return yearA - yearB;
                }
            },
            render: (text, record) => {
                const date = new Date(record.createdAt);
                const day = date.getDate();
                const month = date.getMonth() + 1; // Months are zero-based
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;
            },
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'KHÁCH HÀNG',
            dataIndex: 'fullName',
            key: 'fullName',
            className: 'w-fit',
        },
        {
            title: 'TỔNG',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
            render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        },
        {
            title: 'THANH TOÁN',
            key: 'paymentStatus',
            render: (value: { paymentStatus: number }) => (value.paymentStatus === 1 ? (
                <span className='border bg-green-500 rounded-lg text-white px-2 py-1 text-xs'>
                    Đã thanh toán
                </span>
            ) : (
                <span className='border bg-gray-200 rounded-lg text-gray-500 px-2 py-1 text-xs'>
                    Chưa thanh toán
                </span>
            )),
            sorter: (a, b) => a.paymentStatus - b.paymentStatus, // Sắp xếp theo số
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },
        {
            title: 'TRẠNG THÁI',
            key: 'status',
            render: (value: { status: number }, record:DataType) => {
                let statusText, statusColor;
                const orderStatus = [
                    { status: 0, statusText: 'Chờ xác nhận' },
                    { status: 1, statusText: 'Đóng gói' },
                    { status: 2, statusText: 'Đơn đã hủy' },
                    { status: 3, statusText: 'Đang giao' },
                    { status: 4, statusText: 'Hoàn thành' },
                ];
                switch (value.status) {
                    case 0:
                        statusText = 'Chờ xác nhận';
                        statusColor = 'bg-red-500 text-white';
                        break;
                    case 1:
                        statusText = 'Đóng gói';
                        statusColor = 'bg-gray-200 text-gray-500';
                        break;
                    case 2:
                        statusText = 'Đơn đã hủy';
                        statusColor = 'bg-yellow-400 text-white';
                        break;
                    case 3:
                        statusText = 'Đang giao';
                        statusColor = 'bg-blue-500 text-white';
                        break;
                    case 4:
                        statusText = 'Hoàn thành';
                        statusColor = 'bg-green-500 text-white';
                        break;
                    default:
                        statusText = '';
                        statusColor = '';
                }

                return (
                    <Select onSelect={(value)=>changeStatus({id: record._id, newStatus: {newStatus: value}})} defaultValue={value.status} className={`border rounded-lg px-2 py-1 text-xs w-full ${statusColor}`}>
                        <Select.Option className={statusColor} key={value.status} value={value.status}>{statusText}</Select.Option>
                        {orderStatus.filter(item=>item.status !== value.status).map(item=>(
                        <Select.Option key={item.status} value={item.status}>{item.statusText}</Select.Option>
                        ))}
                    </Select>
                );
            },
            sorter: (a, b) => {
                const customOrder = [1, 2, 3, 4, 0];
                const orderA = customOrder.indexOf(a.status);
                const orderB = customOrder.indexOf(b.status);

                return orderA - orderB;
            },
            sortDirections: ['ascend', 'descend'],
            showSorterTooltip: false,
        },

        {
            title: '',
            key: 'action',
            render: (record: DataType) => (
                <Space size="middle" className='flex justify-end'>
            <Popconfirm
              placement="topLeft"
              title={"Are you fucking sure?"}
              onConfirm={() => confirm(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ style: { backgroundColor: 'red' } }}
            >
              <Button>
                {isRemoveLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </Popconfirm>
                    <Link to={`/admin/order/${record?.key}`}>
                       Sửa
                    </Link>
                </Space>
            ),
        },

    ];

    let data: DataType[] = [];

    if (orders) {
        data = filterData(orders).map((order: IOrderResponse) => ({
            _id: String(order._id),
            key: String(order._id),
            createdAt: order.createdAt,
            fullName: order.fullName,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            totalPrice: order.totalPrice,

        }));
    }

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className="">
            <Space className='mb-5'>
                <div className="">
                    <span className="block text-xl text-[#1677ff]">
                        QUẢN LÝ ĐƠN HÀNG
                    </span>
                    {/* <span className="block text-base  text-[#1677ff]">
                        Manage your orders
                    </span> */}
                </div>
            </Space>
            <div className="border p-3 rounded-lg min-h-screen bg-white">
            <div>
          <Space direction="vertical" size="middle">
            <Space.Compact>
              <Select defaultValue={'Tìm kiếm theo'} onChange={(e) => setSearchFilter(e)} placeholder='Tìm theo' options={optionsSearch} />
              <Input placeholder='Tìm kiếm' onChange={(e) => setSearchText(e.target.value)} />
            </Space.Compact>
          </Space>
        </div>
                <Table columns={columns} dataSource={data} pagination={{ pageSize: 10 }} onChange={onChange} />
            </div>
        </div>
    )
}
export default OrderManagementPage;