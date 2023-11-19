import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { Button, Form, Input, message } from "antd";
import { useChangePasswordMutation } from "../../api/auth";

const ChangePassword = () => {
  const authState = useSelector((state: RootState) => state.user.user);
  const [changePassword] = useChangePasswordMutation();
  const onFinish = async (values: any) => {
    console.log("Success:", values);
    await changePassword(values);
    message.info("success");
    form.resetFields();
  };
  console.log(authState);
  const [form] = Form.useForm();
  return (
    <main className="w-4/5 mx-auto">
      <div className="account-info flex justify-center flex-col items-center">
        <h3 className="text-center font-bold text-2xl bg-slate-100 p-8 rounded-lg w-3/4 my-4">
          Thông tin tài khoản
        </h3>
        <div className="">
          <div className=" ">
            <ul className="flex">
              <li className="mb-1 bg-slate-100 mx-3">
                <Link to={`/account`}>Thông tin cá nhân</Link>
              </li>
              <li className="mb-1 bg-slate-100 mx-3">
                <Link to={`/user/cart`}>Giỏ hàng</Link>
              </li>
              <li className="mb-1 bg-slate-100 mx-3">
                <Link to={`/account/orders`}>Đơn hàng</Link>
              </li>
              <li className="mb-1 bg-slate-100 mx-3">
                <Link to={`/account/changePassword`}>Đổi mật khẩu</Link>
              </li>
            </ul>
          </div>
          <div className="px-10 w-4/5">
            <Form
              form={form}
              className="w-full"
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="newPassword"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your newPassword!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="oldPassword"
                name="oldPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your oldPassword!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="confirmNewPassword"
                name="confirmNewPassword"
                rules={[
                  {
                    required: true,
                    message: "Please input your confirmNewPassword!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button danger type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
