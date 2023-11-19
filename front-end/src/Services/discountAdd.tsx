import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateVoucherMutation } from "../api/voucher";
import { useGetCategoriesQuery } from "../api/category";
import { useGetProductsQuery } from "../api/product";
import { Option } from "antd/es/mentions";

const { RangePicker } = DatePicker;

export const VoucherForm = () => {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [addVoucher] = useCreateVoucherMutation();
  const { data: categories } = useGetCategoriesQuery();
  const { data: bookData } = useGetProductsQuery();
  const validVoucherTypes = ["percent", "value"];

  const onFinish = (values) => {
    const { validDate, ...otherValues } = values;
    const [validFrom, validTo] = validDate;

    const voucherData = {
      ...otherValues,
      validFrom,
      validTo,
    };
    console.log(voucherData);

    addVoucher(voucherData)
      .unwrap()
      .then((data) => {
        navigate("/admin/vouchers");
        console.log(data);
        notification.success({
          message: `Thêm thành công ${data?.title}`,
          duration: 5,
          closeIcon: true,
        });
      });
  };
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={"userDiscount"}
        hidden
        label="Title"
        name="role"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[
          { required: true, message: "Please select the type!" },
          {
            validator: (_, value) => {
              if (!validVoucherTypes.includes(value)) {
                return Promise.reject("Invalid type");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Select onChange={handleTypeChange}>
          {validVoucherTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Code"
        name="code"
        rules={[{ required: true, message: "Please input the code!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[{ required: true, message: "Please input the quantity!" }]}
      >
        <Input />
      </Form.Item>
      {selectedType === "percent" ? (
        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please input the discount!" }]}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
        </Form.Item>
      ) : (
        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please input the discount!" }]}
        >
          <InputNumber
            formatter={(value) =>
              `${value} Đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      )}

      <Form.Item
        label="Used"
        name="used"
        rules={[{ required: true, message: "Please input the used count!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Min Order Value"
        name="minOrderValue"
        rules={[
          { required: true, message: "Please input the minimum order value!" },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Category"
        name="categoryIds"
        rules={[{ required: true, message: "Please select the category!" }]}
      >
        <Select style={{ width: "100%" }} placeholder="Danh mục" mode="tags">
          {categories?.map((category) => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Product"
        name="bookIds"
        rules={[{ required: true, message: "Please select the category!" }]}
      >
        <Select style={{ width: "100%" }} placeholder="Sản phẩm" mode="tags">
          {bookData?.map((book) => (
            <Select.Option key={book._id} value={book._id}>
              {book.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Valid date"
        name="validDate"
        rules={[
          { required: true, message: "Please select the valid from date!" },
        ]}
      >
        <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button className="bg-sky-700" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export const DiscountForm = () => {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();
  const [addVoucher] = useCreateVoucherMutation();
  const { data: categories } = useGetCategoriesQuery();
  const { data: bookData } = useGetProductsQuery();
  const validVoucherTypes = ["percent", "value"];

  const onFinish = (values) => {
    const { validDate, ...otherValues } = values;
    const [validFrom, validTo] = validDate;

    const voucherData = {
      ...otherValues,
      validFrom,
      validTo,
    };
    console.log(voucherData);

    addVoucher(voucherData)
      .unwrap()
      .then((data) => {
        navigate("/admin/vouchers");
        console.log(data);
        notification.success({
          message: `Thêm thành công ${data?.title}`,
          duration: 5,
          closeIcon: true,
        });
      });
  };
  const handleTypeChange = (value) => {
    setSelectedType(value);
  };
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        initialValue={"productDiscount"}
        hidden
        label="Title"
        name="role"
        rules={[{ required: true, message: "Please input the title!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Type"
        name="type"
        rules={[
          { required: true, message: "Please select the type!" },
          {
            validator: (_, value) => {
              if (!validVoucherTypes.includes(value)) {
                return Promise.reject("Invalid type");
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <Select onChange={handleTypeChange}>
          {validVoucherTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Quantity" name="quantity">
        <Input />
      </Form.Item>
      {selectedType === "percent" ? (
        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please input the discount!" }]}
        >
          <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
        </Form.Item>
      ) : (
        <Form.Item
          label="Discount"
          name="discount"
          rules={[{ required: true, message: "Please input the discount!" }]}
        >
          <InputNumber
            formatter={(value) =>
              `${value} Đ`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      )}

      <Form.Item
        label="Category"
        name="categoryIds"
        rules={[{ required: true, message: "Please select the category!" }]}
      >
        <Select style={{ width: "100%" }} placeholder="Danh mục" mode="tags">
          {categories?.map((category) => (
            <Select.Option key={category._id} value={category._id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Product"
        name="bookIds"
        rules={[{ required: true, message: "Please select the category!" }]}
      >
        <Select style={{ width: "100%" }} placeholder="Sản phẩm" mode="tags">
          {bookData?.map((book) => (
            <Select.Option key={book._id} value={book._id}>
              {book.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Valid date"
        name="validDate"
        rules={[
          { required: true, message: "Please select the valid from date!" },
        ]}
      >
        <RangePicker showTime={{ format: "HH:mm" }} format="YYYY-MM-DD HH:mm" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button className="bg-sky-700" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
