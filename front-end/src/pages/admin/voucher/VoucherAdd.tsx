import React, { useState } from "react";
import { TabsProps, Tabs } from "antd";
import { Link } from "react-router-dom";
import { VoucherForm, DiscountForm } from "../../../Services/discountAdd";

const VoucherAdd = () => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Voucher",
      children: <VoucherForm></VoucherForm>,
    },
    {
      key: "2",
      label: "Giảm giá",
      children: <DiscountForm></DiscountForm>,
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <>
      <div className="flex items-center justify between">
        <h2>Thêm mới voucher</h2>
        <Link
          to={"/admin/vouchers"}
          className="m-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Quay lại
        </Link>
      </div>
      <Tabs defaultActiveKey="1" items={items} />;
    </>
  );
};

export default VoucherAdd;
