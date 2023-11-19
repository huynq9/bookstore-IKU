import React  from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useCreateCategoryMutation } from '../../../api/category';
import { IBook } from '../../../interfaces/book';
import { Link, useNavigate } from 'react-router-dom';

const CategoryAdd = () => {
    const [addCategory] = useCreateCategoryMutation()
    const navigate = useNavigate()

    const onFinish = (values: IBook) => {
        addCategory(values).unwrap().then((data) => {
            navigate(`/admin/categories`)
            console.log(data);
            notification.success({
                message: `Thêm thành công ${data?.name}`,
                duration: 5,
                closeIcon: true
            })
        })
    };
    return (
        <>  <div className='flex items-center justify-between'>            <h2>Thêm mới sản phẩm</h2>
            <Link to={'/admin/categories'} className='m-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700' >Quay lại</Link></div>


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
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the name!' }]}
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
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button className='bg-sky-700' type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default CategoryAdd;