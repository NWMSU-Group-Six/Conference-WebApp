import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Speakers from "./pages/Speakers";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";
import Submit from "./pages/Submit";
import ScrollToHash from "./utils/scrollToHash";
import Sponsors from "./pages/Sponsors";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
      </div>
      <div className="pt-20">
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/sponsors" element={<Sponsors />} />
        </Routes>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Footer />
      </div>
    </>
  );
}

export default App;
