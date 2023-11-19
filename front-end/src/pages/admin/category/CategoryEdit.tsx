import React, { useEffect } from 'react';
import { Button, Form, Input, notification } from 'antd';
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '../../../api/category';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ICategory } from '../../../interfaces/category';

const CategoryEdit = () => {
  const { id } = useParams()
  const { data: category } = useGetCategoryByIdQuery(id!)
  const [editCategory] = useUpdateCategoryMutation()
  const navigate = useNavigate()
  
  useEffect(() => {
    setFields();
  }, [category, id]);
  

  const onFinish = (values: ICategory) => {
    editCategory(values).unwrap().then((data) => {
      navigate(`/admin/categories`)
      notification.success({
        message: `Sửa thành công ${data?.name}`,
        duration: 5,
        closeIcon: true
      })
    })
  };

  const [form] = Form.useForm();
  const setFields = () => {
    form.setFieldsValue({
      _id: category?._id,
      name: category?.name,
      description: category?.description,
    });
  };



  return (
    <>  <div className='flex items-center justify-between'>            <h2>Sửa</h2>
      <Link to={'/admin/categories'} className='m-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700' >Quay lại</Link></div>

      <Form className='m-auto'
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
          rules={[{ required: true, message: 'Please input the id!' }]}
        >
          <Input />
        </Form.Item>
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

export default CategoryEdit;