import React, { useState, useEffect } from "react";
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
  Tooltip,
  notification,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../../api/product";
import { IBook } from "../../../interfaces/book";
import { CategoryIdType } from "../../../interfaces/category";
import { AuthorIdType } from "../../../interfaces/author";
import { Link } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ImageList from "../../../Services/imageList";
import moment from "moment";
import Search from "antd/es/input/Search";
import type { NotificationPlacement } from "antd/es/notification/interface";
import { useGetCategoriesQuery } from "../../../api/category";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { loadBooks } from "../../../store/book/productSlice";

interface DataType {
  key: string;
  title: string;
  authorId: AuthorIdType[];
  price: number;
  description: string;
  categoryId: CategoryIdType[];
  stock: number;
  sale: number;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
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
    disabled: record.title === "Disabled User", // Column configuration not to be checked
    name: record.title,
  }),
};
const Context = React.createContext({ name: "Xóa" });

const optionsSearch = [
  {
    value: "author",
    label: "Tác giả",
  },
  {
    value: "category",
    label: "Danh mục",
  },
  {
    value: "name",
    label: "Tên sách",
  },
];
const ProductList = () => {
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectionType, setSelectionType] = useState<"checkbox" | "radio">(
    "checkbox"
  );
  const { data: bookData, isLoading } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [removeBook, { isLoading: isRemoveLoading }] =
    useDeleteProductMutation();
  const books = useSelector((state: RootState) => state.products.books);
  const dispatch = useDispatch();
  console.log(books);
  useEffect(() => {
    if (bookData && bookData.length > 0) {
      dispatch(loadBooks(bookData));
    }
  }, [bookData]);
  const confirm = (id: string) => {
    console.log(id);
    removeBook(id)
      .unwrap()
      .then((data) => {
        openNotification("topRight", data?.title);
      });
  };
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    titleProduct: string
  ) => {
    api.success({
      message: `Thông báo`,
      description: (
        <Context.Consumer>
          {({ name }) => `${name} thành công ${titleProduct}!`}
        </Context.Consumer>
      ),
      placement,
    });
  };

  const filterData = () => {
    let filteredData = Array.isArray(books) ? books : [];

    if (searchFilter === "author") {
      // Lọc dựa trên tác giả
      filteredData = filteredData.filter((item) => {
        return item.authorId.some((author) =>
          author.name.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    } else if (searchFilter === "category") {
      // Lọc dựa trên danh mục
      filteredData = filteredData.filter((item) => {
        return item.categoryId.some((category) =>
          category.name.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    } else if (searchFilter === "name") {
      // Lọc dựa trên tên sách
      filteredData = filteredData.filter((item) =>
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return filteredData;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "authorId",
      key: "authorId",
      render: (authorId: AuthorIdType[]) => (
        // Render danh sách tác giả dựa trên authorId
        <ul>
          {authorId.map((item) => (
            <li key={item._id}>{item.name}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Category",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (categoryId: CategoryIdType[]) => (
        // Render danh sách danh mục dựa trên categoryId
        <ul>
          {categoryId.map((item) => (
            <Link key={item._id} to={`#`}>
              <Button>{item.name}</Button>
            </Link>
          ))}
        </ul>
      ),
    },
    {
      title: "Book Images",
      dataIndex: "images",
      key: "image",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <ImageList images={text || [""]} />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Sale %",
      dataIndex: "sale",
      key: "sale",
    },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      key: "publishedAt",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: ({ key: id }) => {
        return (
          <>
            <Popconfirm
              placement="topLeft"
              title={"Are you  sure?"}
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
            <Button type="primary" danger className="ml-2">
              <Link to={`/admin/product/${id}/edit`}>Edit</Link>
            </Button>
          </>
        );
      },
    },
  ];

  const data: DataType[] = filterData().map((item: IBook) => ({
    key: item._id || "defaultKey",
    title: item.title,
    authorId: item.authorId,
    price: item.price,
    description: item.description,
    categoryId: item.categoryId,
    images: item.images,
    stock: item.stock,
    publishedAt: item.publishedAt,
    updatedAt: item.updatedAt,
    createdAt: item.createdAt,
    sale: item.sale,
  }));
  return (
    <>
      {contextHolder}
      <h2 className="text-2xl py-4">Quản lý sản phẩm</h2>
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
            title={"Are you  sure?"}
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
            <Link to={`/admin/product/add`}>Thêm mới</Link>
          </Button>
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
            className="w-fit"
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

export default ProductList;
