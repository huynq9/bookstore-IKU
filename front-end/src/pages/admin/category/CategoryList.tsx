import React, { useState } from 'react';
import { Button, Divider, Popconfirm, Radio, Skeleton, Table, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Search from 'antd/es/input/Search';
import type { NotificationPlacement } from 'antd/es/notification/interface';
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../../../api/category';
import { ICategory } from '../../../interfaces/category';

interface DataType {
  key: string;
  name: string,
  description: string,
  updatedAt: Date;
  createdAt: Date;
}
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};
const Context = React.createContext({ name: 'Xóa' });


const CategoryList = () => {
  const [searchText, setSearchText] = useState('')
  const [selectionType, setSelectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const { data: categories, isLoading } = useGetCategoriesQuery()
  const [removeCategory, { isLoading: isRemoveLoading }] = useDeleteCategoryMutation()


  const confirm = (id: string) => {
    console.log(id);
    removeCategory(id).unwrap().then((data: unknown) => {
      if (typeof data === 'object' && data !== null) {
        const category = data as { name: string };
        openNotification('topRight', category?.name);
      }
    });
  }
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (placement: NotificationPlacement, titleCategory: string) => {
    api.success({
      message: `Thông báo`,
      description: <Context.Consumer>{({ name }) => `${name} thành công ${titleCategory}!`}</Context.Consumer>,
      placement,
    });
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: "Action",
      key: "action",
      render: ({ key: id }) => {
        return (
          <>
            <Popconfirm
              placement="topLeft"
              title={"Are you fucking sure?"}
              onConfirm={() => confirm(id)}
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
            <Button type="primary" danger className="ml-2">
              <Link to={`/admin/category/${id}/edit`}>Edit</Link>
            </Button>
          </>
        );
      },
    },
  ];


  const data: DataType[] = (Array.isArray(categories) ? categories : []).filter(item => item.name.toLowerCase().includes(searchText.toLowerCase())).map((item: ICategory) => ({
    key: item._id || 'defaultKey',
    name: item.name,
    description: item.description,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt
  }))
  return (
    <>{contextHolder}
      <h2 className='text-2xl py-4'>Quản lý danh mục</h2>
      <div>
        <Radio.Group
          onChange={({ target: { value } }) => {
            setSelectionType(value);
          }}
          value={selectionType}
        >
          <Radio value="checkbox">Checkbox</Radio>
          <Radio value="radio">radio</Radio>
        </Radio.Group>
        <>
          <Popconfirm
            placement="topRight"
            title={"Are you fucking sure?"}
            okText="Yes"
            cancelText="No"
          >
            <Button>
              {isRemoveLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Xóa đã chọn"
              )}
            </Button>
          </Popconfirm>
          <Button type="primary" ghost className="ml-2">
            <Link to={`/admin/category/add`}>Thêm mới</Link>
          </Button>
        </>
        <Divider />
        <Search className='w-1/3 pb-4 ' placeholder="input search " enterButton onChange={(e) => setSearchText(e.target.value)} />
        {isLoading ? <Skeleton /> : <Table className='w-full'
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />}

      </div>
    </>

  );
}

export default CategoryList