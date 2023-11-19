import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutC from "./components/client/LayoutC";
import Home from "./pages/client/Home";
import LayoutA from "./components/admin/LayoutA";
import DashBoard from "./pages/admin/DashBoard";
import SignIn from "./pages/client/SignIn";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutC />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/admin" element={<LayoutA />}>
            <Route index element={<DashBoard />} />
          </Route>
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
