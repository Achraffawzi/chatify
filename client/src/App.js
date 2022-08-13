import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/signup/Signup.js";
import Signin from "./pages/auth/signin/Signin.js";
import ForgetPassword from "./pages/auth/forgetPassword/ForgetPassword.js";
import ResetPassword from "./pages/auth/resetPassword/ResetPassword.js";
import Home from "./pages/auth/home/Home.js";
// import Home from "./pages/auth/home/Home.js";

import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
