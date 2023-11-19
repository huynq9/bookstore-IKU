import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const items: MenuProps["items"] = [
  {
    key: "1",
    icon: <UserOutlined />,
    label: <Link to={"/admin/dashboard"}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <VideoCameraOutlined />,
    label: <Link to={"/admin/products"}>Sản phẩm</Link>,
  },
  {
    key: "3",
    icon: <UploadOutlined />,
    label: <Link to={"/admin/categories"}>Danh mục</Link>,
  },
  {
    key: "5",
    icon: <UploadOutlined />,
    label: <Link to={"/admin/vouchers"}>Khuyến mại</Link>,
  },
  {
    key: "6",
    icon: <UploadOutlined />,
    label: <Link to={"/admin/orders"}>Đơn hàng</Link>,
  },
  {
    key: "7",
    icon: <UploadOutlined />,
    label: <Link to={"/admin/users"}>Người dùng</Link>,
  },
];

const LayoutAdmin = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={items}
        />
      </Sider>
      <Layout className="site-layout" style={{ marginLeft: 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "24px 16px 0", overflow: "initial" }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
