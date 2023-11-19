import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import './App.css';
// import "~slick-carousel/slick/slick.css"; 
// import "~slick-carousel/slick/slick-theme.css";

const App = () => {
    return (
        <div>
            <RouterProvider router={router} />
        </div>
    );
};

export default App;