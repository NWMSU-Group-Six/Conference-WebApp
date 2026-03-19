import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Speakers from "./pages/Speakers";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";
import Submit from "./pages/Submit";
import ScrollToHash from "./utils/scrollToHash";
import Schedule from "./pages/Schedule";
import Committee from "./pages/Committee";
import Sponsors from "./pages/Sponsors";
import Submission from "./pages/Submission";
import Signup from "./pages/Signup";
import Registration from "./pages/Registration";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
      </div>
      <div className="pt-[84px]">
        <ScrollToHash />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/committee" element={<Committee />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Footer />
      </div>
    </>
  );
}

export default App;
