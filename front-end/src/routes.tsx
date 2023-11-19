import { Navigate, createBrowserRouter } from "react-router-dom";
import LayoutClient from "./components/layouts/LayoutClient";
import LayoutAdmin from "./components/layouts/LayoutAdmin";
import Dashboard from "./pages/admin/Dashboard";
import ProductList from "./pages/admin/product/ProductList";
import ProductAdd from "./pages/admin/product/ProductAdd";
import ProductEdit from "./pages/admin/product/ProductEdit";
import CategoryList from "./pages/admin/category/CategoryList";
import CategoryAdd from "./pages/admin/category/CategoryAdd";
import CategoryEdit from "./pages/admin/category/CategoryEdit";
import HomePage from "./pages/client/HomePage";
import VoucherAdd from "./pages/admin/voucher/VoucherAdd";
import VoucherList from "./pages/admin/voucher/VoucherList";
import VoucherEdit from "./pages/admin/voucher/VoucherEdit";
import ClientProductList from "./pages/client/ProductList";
import ProductDetail from "./pages/client/ProductDetail";
import Cart from "./pages/client/Cart";
import Checkout from "./pages/client/Checkout";
import OrderDetail from "./pages/client/OrderDetail";
import OrderList from "./pages/client/OrderList";
import Account from "./pages/client/Account";
import ChangePassword from "./pages/client/ChangePassword";

import OrderManagementPage from "./pages/admin/order/OrderList";
import UserList from "./pages/admin/user/UserList";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutClient />,
    children: [
      { index: true, element: <Navigate to={"home"} /> },
      { path: "home", element: <HomePage /> },
      { path: "products", element: <ClientProductList /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "user/cart/", element: <Cart /> },
      { path: "order/checkout/", element: <Checkout /> },
      { path: "order/:id", element: <OrderDetail /> },
      { path: "account/orders", element: <OrderList /> },
      { path: "account/", element: <Account /> },
      { path: "account/changePassword", element: <ChangePassword /> },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      { index: true, element: <Navigate to={"dashboard"} /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "products", element: <ProductList /> },
      { path: "product/add", element: <ProductAdd /> },
      { path: "product/:id/edit", element: <ProductEdit /> },
      { path: "categories", element: <CategoryList /> },
      { path: "category/add", element: <CategoryAdd /> },
      { path: "category/:id/edit", element: <CategoryEdit /> },
      { path: "voucher/add", element: <VoucherAdd /> },
      { path: "vouchers", element: <VoucherList /> },
      { path: "voucher/:id/edit/:type", element: <VoucherEdit /> },
      { path: "orders", element: <OrderManagementPage /> },
      { path: "users", element: <UserList /> },
    ],
  },
]);
