import {
  Badge,
  Dropdown,
  MenuProps,
  Modal,
  Select,
  Tabs,
  TabsProps,
} from "antd";

import { Link, Outlet, useNavigate } from "react-router-dom";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth/authSlice";
import { PURGE } from "redux-persist";
import { useGetCartQuery } from "../../api/cart";
import { ICartState, loadCart } from "../../store/cart/cartSlice";
import { setSearchTerm, setSearchType } from "../../store/search/searchSlice";
import { selectCategory } from "../../store/category/categorySlice";
import { useEffect, useState } from "react";

const LayoutClient = () => {
  const [modal2Open, setModal2Open] = useState(false);
  const authState = useSelector((state: RootState) => state.user);
  const getCart: ICartState = useSelector((state: RootState) => state.carts);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const searchType = useSelector((state: RootState) => state.search.searchType);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: cartData, isSuccess: fetchCartSuccess } = useGetCartQuery();
  const onChange = (key: string) => {
    console.log(key);
  };
  const optionsSearch = [
    {
      value: "bookTitle",
      label: "Tên sách",
    },
    {
      value: "authorName",
      label: "Tác giả",
    },
    {
      value: "categoryName",
      label: "Danh mục",
    },
  ];
  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Đăng nhập",
      children: <Login setModalState={setModal2Open} />,
    },
    {
      key: "2",
      label: "Đăng ký",
      children: <Register setModalState={setModal2Open} />,
    },
  ];
  const [items, setItems] = useState<MenuProps["items"]>([
    {
      label: <Link to={`/account/`}>Thông tin tài khoản</Link>,
      key: "1",
    },
    {
      label: <Link to={`/account/orders`}>Đơn hàng</Link>,
      key: "2",
    },
    {
      label: (
        <Link to={`/home`} onClick={() => handleLogout()}>
          Đăng xuất
        </Link>
      ),
      key: "3",
    },
  ]);
  const handleLogout = async () => {
    dispatch(logout());
    dispatch({ type: PURGE, key: ["user"] });
    dispatch({ type: PURGE, key: ["carts"] });
    // navigate('/home')
    navigate("/home", { replace: true });
  };
  useEffect(() => {
    if (items) {
      const updatedItems = [...items];
      if (authState.user?.role === "admin") {
        updatedItems[4] = {
          label: <Link to={`/admin/dashboard`}>Vào trang admin</Link>,
          key: 4,
        };
        setItems(updatedItems);
      }
    }
  }, [authState]);
  useEffect(() => {
    if (authState.user && fetchCartSuccess) {
      dispatch(loadCart(cartData));
    }
  }, [authState, fetchCartSuccess]);

  const handleSearch = () => {
    navigate(`/products?searchType=${searchType}&search=${searchTerm}`);
  };

  return (
    <>
      <header>
        <header className="bg-[#444fc9] py-3 sm:px-10 px-6 font-[sans-serif] min-h-[60px]">
          <div className="flex flex-wrap items-center lg:gap-y-2 gap-y-4 gap-x-4">
            <a href="javascript:void(0)">
              <p className="text-2xl text-white">BOOKSTORE</p>
            </a>
            <div className="flex items-center ml-auto lg:order-1">
              <div className="flex items-center">
                {authState.isLoggedIn ? (
                  <Dropdown
                    placement="bottom"
                    arrow={{ pointAtCenter: true }}
                    menu={{ items }}
                  >
                    <a onClick={(e) => e.preventDefault()}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="bi bi-person text-white mt-2 mx-3"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                    </a>
                  </Dropdown>
                ) : (
                  <a className="p-0" onClick={() => setModal2Open(true)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      className="bi bi-person text-white mt-2 mx-3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>
                  </a>
                )}
                <Link to={"/user/cart"} className="relative mr-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    className="cursor-pointer hover:fill-[#FFA726] inline-block"
                    fill="#fff"
                  >
                    <path
                      d="M1 1a1 1 0 1 0 0 2h1.78a.694.694 35.784 0 1 .657.474l3.297 9.893c.147.44.165.912.053 1.362l-.271 1.087C6.117 17.41 7.358 19 9 19h12a1 1 0 1 0 0-2H9c-.39 0-.64-.32-.545-.697l.205-.818A.64.64 142.028 0 1 9.28 15H20a1 1 0 0 0 .95-.684l2.665-8A1 1 0 0 0 22.666 5H6.555a.694.694 35.783 0 1-.658-.474l-.948-2.842A1 1 0 0 0 4 1zm7 19a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                      data-original="#000000"
                      paintOrder="fill markers stroke"
                    />
                  </svg>
                  <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">
                    {getCart.items.length}
                  </span>
                </Link>
                <Select
                  defaultValue={"Tìm kiếm theo"}
                  onChange={(e) => dispatch(setSearchType(e))}
                  placeholder="Tìm theo"
                  options={optionsSearch}
                  className=""
                />
                <input
                  type="text"
                  placeholder="Search something..."
                  onChange={(e) => {
                    dispatch(setSearchTerm(e.target.value));
                    dispatch(selectCategory(null));
                  }}
                  className="bg-gray-50 focus:bg-white w-full px-6 rounded h-9 outline-none text-sm relative"
                />
                <button
                  type="submit"
                  className="mr-5"
                  onClick={() => handleSearch()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-search top-5 right-16 absolute"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg>
                </button>
              </div>
              <button className=" lg:hidden ml-7">
                <svg
                  className="w-7 h-7"
                  fill="#fff"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <ul className="flex lg:ml-8 max-lg:block max-lg:w-full lg:space-x-4 max-lg:space-y-2">
              <li className="max-lg:border-b max-lg:py-2 px-3">
                <Link
                  to={"/"}
                  className="text-[#FFA726] hover:text-[#FFA726] text-[15px] block font-semibold"
                >
                  Trang chủ
                </Link>
              </li>
              <li className="max-lg:border-b max-lg:py-2 px-3">
                <Link
                  to={"/products"}
                  className="text-white hover:text-[#FFA726] text-[15px] block font-semibold"
                >
                  Quầy sách
                </Link>
              </li>
            </ul>
          </div>
        </header>
      </header>
      <Modal
        title={<img className="w-40 flex justify-center" src="/logo.png" />}
        centered
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        open={modal2Open}
        onCancel={() => setModal2Open(false)}
      >
        <Tabs
          centered
          destroyInactiveTabPane={true}
          defaultActiveKey="1"
          items={tabItems}
          onChange={onChange}
        />
      </Modal>
      <div className="mt-4">
        <Outlet />
      </div>

      <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img src="logo.png" className="w-48" alt="Flowbite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Book Store
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2023{"{"}" "{"}"}
            <a href="https://flowbite.com/" className="hover:underline">
              Nguyễn Quang Huy
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
};

export default LayoutClient;
