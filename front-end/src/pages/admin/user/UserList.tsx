import React, { useState } from "react";
import {
  Button,
  Divider,
  Input,
  Popconfirm,
  Radio,
  Select,
  Skeleton,
  Space,
  Table,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { CategoryIdType } from "../../../interfaces/category";
import { AuthorIdType } from "../../../interfaces/author";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ImageList from "../../../Services/imageList";
import moment from "moment";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { useDeleteUserMutation, useGetUsersQuery } from "../../../api/auth";
import { IUser } from "../../../interfaces/auth";

interface DataType {
  key: string;
  _id: string;
  username: string;
  email: string;
  role: string;
}
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.username === "Disabled User",
    name: record.username,
  }),
};
const Context = React.createContext({ name: "Xóa" });

const optionsSearch = [
  {
    value: "username",
    label: "username",
  },
  {
    value: "email",
    label: "email",
  },
];
const UserList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const { data: userData, isLoading } = useGetUsersQuery();
  const [removeUser, { isLoading: isRemoveLoading }] = useDeleteUserMutation();

  const confirm = (id: string) => {
    removeUser(id)
      .unwrap()
      .then(() => {
        openNotification("topRight", "");
      });
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    title: string
  ) => {
    api.success({
      message: `Thông báo`,
      description: (
        <Context.Consumer>
          {({ name }) => `${name} thành công ${title}!`}
        </Context.Consumer>
      ),
      placement,
    });
  };

  const filterData = () => {
    let filteredData = Array.isArray(userData) ? userData : [];

    if (searchFilter === "username") {
      // Lọc dựa trên tác giả
      filteredData = filteredData.filter((item) =>
        item.username.toLowerCase().includes(searchText.toLowerCase())
      );
    } else if (searchFilter === "email") {
      // Lọc dựa trên danh mục
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredData;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "_id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "username",
      dataIndex: "username",
      key: "username",
    },

    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
              okButtonProps={{ style: { backgroundColor: "red" } }}
            >
              <Button>
                {isRemoveLoading ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const data: DataType[] = filterData().map((item: IUser) => ({
    key: String(item._id) || "defaultKey",
    _id: String(item._id),
    username: item.username,
    email: item.email,
    role: item.role,
  }));
  return (
    <>
      {contextHolder}
      <h2 className="text-2xl py-4">Quản lý người dùng</h2>
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
          {/* <Button type="primary" ghost className="ml-2">
            <Link to={`/admin/product/add`}>Thêm mới</Link>
          </Button> */}
        </>
        <Divider />
        <div>
          <Space direction="vertical" size="middle">
            <Space.Compact>
              <Select
                onChange={(e) => setSearchFilter(e)}
                placeholder="Tìm theo"
                options={optionsSearch}
              />
              <Input
                placeholder="Tìm kiếm"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Space.Compact>
          </Space>
        </div>

        {isLoading ? (
          <Skeleton />
        ) : (
          <Table
            className="w-full"
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
          />
        )}
      </div>
    </>
  );
};

export default UserList;
