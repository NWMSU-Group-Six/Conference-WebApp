import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Speakers from "./pages/Speakers";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";
import CallForPapers from "./pages/call-for-papers/call-for-papers";
import Submission from "@/pages/Submission/Submission";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <NavBar />
      </div>
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/call-for-papers" element={<CallForPapers />} />
          <Route path="/submission" element={<Submission />} />
        </Routes>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Footer />
      </div>
    </>
  );
}

export default App;
