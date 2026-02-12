import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
      </div>
      <div className="pt-25">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Footer />
      </div>
    </>
  );
}

export default App;
