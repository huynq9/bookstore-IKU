import React, { useState } from 'react';
import { Button, Form, Input, Select, Upload, notification } from 'antd';
import { useGetCategoriesQuery } from '../../../api/category';
import { IBook } from '../../../interfaces/book';
import { useGetAuthorsQuery } from '../../../api/author';
import { useAddProductMutation } from '../../../api/product';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { UploadProps } from 'antd/es/upload/interface';
import {LoadingOutlined} from '@ant-design/icons';

const ProductAdd = () => {
    const { data: categories } = useGetCategoriesQuery()
    const { data: authors } = useGetAuthorsQuery()
    const [addBook, { isLoading, isSuccess }] = useAddProductMutation()
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate()

    const onFinish = (values: IBook) => {
        console.log('Form values:', values);
        // console.log('Uploaded files:', fileList);
        const imageObjects = fileList.map(file => ({
            url: file.url,
            publicId: file.publicId
        }));
        values.images = imageObjects;
        addBook(values).unwrap().then((data) => {
            navigate(`/admin/products`)
            notification.success({
                message: `Thêm thành công ${data?.title}`,
                duration: 5,
                closeIcon: true
            })
        })
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    const uploadImages = async options => {
        // console.log(options);
        const { onSuccess, onError, file } = options;

        const formData = new FormData()

        formData.append("images", file)
        try {
            const res = await axios.post("http://localhost:8088/api/images/upload", formData)
            const { data } = res
            if (data && data.publicId) {
                file.publicId = data.publicId;
                file.url = data.url;

                onSuccess("Ok");
            } else {
                onError({ message: "Không có publicId trong phản hồi" });
            }
        } catch (err) {
            onError({ err });
        }
    }
    const handleRemoveImage = async (file) => {
        // Gọi API xóa ảnh trên máy chủ
        // console.log(file);
        try {
            await axios.delete(`http://localhost:8088/api/images/remove/${file.publicId}`);
    
            notification.success({
                message: "Xóa ảnh thành công",
                duration: 5,
                closeIcon: true
            });
        } catch (error) {
            // console.error("Lỗi khi xóa ảnh", error);
        }
    };


    return (
        <>  <div className='flex items-center justify-between'>            <h2>Thêm mới sản phẩm</h2>
            <Button className='m-4' type="primary" ghost>Quay lại</Button></div>

            <Form className='m-auto'
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
                    rules={[{ required: true, message: 'Please input the title!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Author"
                    name="authorName"
                    rules={[{ required: true, message: 'Please input/select the author!' }]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Tác giả"
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
                    rules={[{ required: true, message: 'Please input the price!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[{ required: true, message: 'Please select the category!' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Tác giả"
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
                    rules={[{ required: true, message: 'Please input the stock!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item name="images"
                >
                    <Upload
                        multiple
                        fileList={fileList}
                        onChange={handleChange}
                        listType="picture"
                        customRequest={uploadImages}
                        iconRender={() => <LoadingOutlined />}
                        onRemove={(file) => handleRemoveImage(file)}
                    >
                        {fileList.length >= 8 ? null : <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>}
                    </Upload>
                </Form.Item>
                <Form.Item
                    label="Published At"
                    name="publishedAt"
                    rules={[{ required: true, message: 'Please input the publish date!' }]}
                >
                    <Input type="date" />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button className='bg-sky-700' type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ProductAdd;