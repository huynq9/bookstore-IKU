import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

interface Props {}

const LayoutA = (props: Props) => {
  return (
    <div className="w-12/12 flex">
      <div className="w-2/12 ">
        <Header />
      </div>
      <div className="w-9/12 mx-auto ">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutA;
