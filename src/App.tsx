import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Speakers from "./pages/Speakers";
import NavBar from "@/components/custom/NavBar";
import Footer from "@/components/custom/Footer";
import Submit from "./pages/Submit";
import ScrollToHash from "./utils/scrollToHash";
import  Schedule from "./pages/Schedule";
import  Committee from "./pages/Committee";
import Sponsors from "./pages/Sponsors";
import Submission from "./pages/Submission";
import Signup from "./pages/Signup";
import Registration from "./pages/Registration";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type{ User} from "firebase/auth";
import { auth } from "./firebase/firebase";
function App() {
   const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (user) {
        console.log("Still signed in:", user.email);
      } else {
        console.log("No user signed in");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
    <NavBar user={user}/>
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
        </Routes>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Footer />
      </div>
    </>
  );
}

export default App;
