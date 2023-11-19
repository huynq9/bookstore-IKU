import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { useChangePasswordMutation } from "../../api/auth";

const Account = () => {
  const authState = useSelector((state: RootState) => state.user.user);
  console.log(authState);

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
          <div className="px-10">
            <div className="max-w-sm rounded overflow-hidden shadow-lg">
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  Username:
                  {authState?.username}
                </div>
                <p className="text-gray-700 text-base">
                  Email: {authState?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Account;
