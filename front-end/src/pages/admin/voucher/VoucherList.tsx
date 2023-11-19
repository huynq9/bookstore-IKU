import React, { useState } from 'react';
import { Button, Divider, Popconfirm, Radio, Skeleton, Table, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import Search from 'antd/es/input/Search';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { useDeleteVoucherMutation, useGetVouchersQuery } from '../../../api/voucher';
import IVoucher from '../../../interfaces/voucher';

interface DataType {
  key: string;
  title: string;
  type: 'percent' | 'value' | 'Type3';
  code: string;
  quantity: number;
  discount: number;
  used: number;
  minOrderValue: number;
  validFrom: Date;
  validTo: Date;
  role: string
}

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.title === 'Disabled Voucher',
    title: record.title,
  }),
};

const Context = React.createContext({ name: 'Delete' });

const VoucherList = () => {
  const [searchText, setSearchText] = useState('');
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const { data: vouchers, isLoading } = useGetVouchersQuery();
  const [removeVoucher, { isLoading: isRemoveLoading }] = useDeleteVoucherMutation();

  const confirm = (id: string) => {
    removeVoucher(id)
      .unwrap()
      .then((data: unknown) => {
        if (typeof data === 'object' && data !== null) {
          const voucher = data as { title: string };
          openNotification('topRight', voucher?.title);
        }
      });
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (placement: NotificationPlacement, titleVoucher: string) => {
    api.success({
      message: `Notification`,
      description: <Context.Consumer>{({ name }) => `${name} successful ${titleVoucher}!`}</Context.Consumer>,
      placement,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Used',
      dataIndex: 'used',
      key: 'used',
    },
    {
      title: 'Min Order Value',
      dataIndex: 'minOrderValue',
      key: 'minOrderValue',
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
    },
    {
      title: 'Valid To',
      dataIndex: 'validTo',
      key: 'validTo',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => (
        <>
          <Popconfirm
            placement="topLeft"
            title="Are you sure?"
            onConfirm={() => confirm(record.key)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ style: { backgroundColor: 'red' } }}
          >
            <Button>
              {isRemoveLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </Popconfirm>
          <Button type="primary" danger className="ml-2">
            <Link to={`/admin/voucher/${record.key}/edit/${record.role}`}>Edit</Link>
          </Button>
        </>
      ),
    },
  ];

  const data: DataType[] = (Array.isArray(vouchers) ? vouchers : [])
    .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()))
    .map((item: IVoucher) => ({
      key: item._id || 'defaultKey',
      title: item.title,
      type: item.type,
      code: item.code,
      quantity: item.quantity,
      discount: item.discount,
      used: item.used,
      minOrderValue: item.minOrderValue,
      validFrom: item.validFrom,
      validTo: item.validTo,
      role: item.role
    }));

  return (
    <>
      {contextHolder}
      <h2 className="text-2xl py-4">Voucher Management</h2>
      <div>
        <Radio.Group
          onChange={({ target: { value } }) => {
            setSelectionType(value);
          }}
          value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">Radio</Radio>
        </Radio.Group>
        <>
          <Popconfirm
            placement="topRight"
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
          >
            <Button>
              {isRemoveLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                'Delete Selected'
              )}
            </Button>
          </Popconfirm>
          <Button type="primary" ghost className="ml-2">
            <Link to="/admin/voucher/add">Add New</Link>
          </Button>
        </>
        <Divider />
        <Search className="w-1/3 pb-4" placeholder="Search" enterButton onChange={e => setSearchText(e.target.value)} />
        {isLoading ? <Skeleton /> : <Table className="w-full" rowSelection={{ type: selectionType, ...rowSelection }} columns={columns} dataSource={data} />}
      </div>
    </>
  );
};

export default VoucherList;