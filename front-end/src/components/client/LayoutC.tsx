import HeaderC from "./Header";
import FooterC from "./Footer";
import { Outlet } from "react-router-dom";

const LayoutC = () => {
  return (
    <>
      <div>
        <HeaderC />
      </div>
      <div>
        <Outlet />
      </div>
      <div>
        <FooterC />
      </div>
    </>
  );
};

export default LayoutC;
