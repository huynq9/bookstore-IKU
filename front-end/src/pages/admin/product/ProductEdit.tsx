import React, { useState, useEffect } from "react";
import { Button, Form, Input, Select, Upload, notification } from "antd";
import { useGetCategoriesQuery } from "../../../api/category";
import { IBook } from "../../../interfaces/book";
import { useGetAuthorsQuery } from "../../../api/author";
import {
  useEditProductMutation,
  useGetProductByIdQuery,
} from "../../../api/product";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const ProductEdit = () => {
  const { data: categories } = useGetCategoriesQuery();
  const { data: authors } = useGetAuthorsQuery();
  const { id } = useParams();
  const { data: book } = useGetProductByIdQuery(id!);
  const [editBook] = useEditProductMutation();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    setFields();
    const setImages =
      book?.images.map((img) => ({
        uid: img.publicId,
        name: "image.jpg", // Thêm thuộc tính name
        publicId: img.publicId,
        url: img.url,
      })) || [];
    setFileList(setImages);
  }, [book]);

  const onFinish = (values: IBook) => {
    const imageObjects = fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response[0].url,
          publicId: file.response[0].publicId,
        };
      } else if ("publicId" in file && "url" in file) {
        return {
          url: file.url,
          publicId: file.publicId,
        };
      }
    });
    const filteredImageObjects = imageObjects.filter(
      (item) => item !== null
    ) as { url: string; publicId: string }[];

    values.images = filteredImageObjects;
    editBook(values)
      .unwrap()
      .then((data) => {
        navigate(`/admin/products`);
        notification.success({
          message: `Sửa thành công ${data?.title}`,
          duration: 5,
          closeIcon: true,
        });
      });
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleRemoveImage = async (file: UploadFile) => {
    // Gọi API xóa ảnh trên máy chủ

    try {
      if ("publicId" in file) {
        await axios.delete(
          `http://localhost:8088/api/images/remove/${file.publicId}`
        );
        notification.success({
          message: "Xóa ảnh thành công",
          duration: 5,
          closeIcon: true,
        });
      }
    } catch (error) {
      // console.error("Lỗi khi xóa ảnh", error);
    }
  };
  const [form] = Form.useForm();
  const setFields = () => {
    form.setFieldsValue({
      _id: book?._id,
      title: book?.title,
      description: book?.description,
      authorName: book?.authorId.map((autho) => autho._id),
      price: book?.price,
      stock: book?.stock,
      publishedAt: moment(book?.publishedAt).format("YYYY-MM-DD"),
      images: book?.images.map((img) => ({
        uid: img.publicId,
        publicId: img.publicId,
        url: img.url,
      })),
      categoryId: book?.categoryId.map((category) => category._id),
      sale: book?.sale,
    });
  };

  return (
    <>
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <h2>Thêm mới sản phẩm</h2>
        <Link
          to={"/admin/products"}
          className="m-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Quay lại
        </Link>
      </div>
      <Form
        className="m-auto"
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          hidden
          label="id"
          name="_id"
          rules={[{ required: true, message: "Please input the id!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Author"
          name="authorName"
          rules={[
            { required: true, message: "Please input/select the author!" },
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Tác giả"
            tokenSeparators={[","]}
          >
            {authors?.map((author) => (
              <Select.Option key={author._id} value={author._id}>
                {author.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input the price!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the description!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Category"
          name="categoryId"
          rules={[{ required: true, message: "Please select the category!" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Danh mục"
            mode="multiple"
          >
            {categories?.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please input the stock!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sale"
          name="sale"
          rules={[{ required: true, message: "Please input the sale!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="images">
          <Upload
            name="images"
            multiple
            action={"http://localhost:8088/api/images/upload"}
            fileList={fileList}
            onChange={handleChange}
            listType="picture"
            iconRender={() => <LoadingOutlined />}
            onRemove={(file) => handleRemoveImage(file)}
          >
            {fileList.length >= 8 ? null : (
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            )}
          </Upload>
        </Form.Item>
        <Form.Item
          label="Published At"
          name="publishedAt"
          rules={[
            { required: true, message: "Please input the publish date!" },
          ]}
        >
          <Input type="date" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button className="bg-sky-700" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default ProductEdit;
