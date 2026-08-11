import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLenis } from './hooks/useLenis';
// import Login from "./pages/Login";
import Home from './pages/Home';
import Login from './components/Navbar/Login';

export default function App() {
  useLenis();

  // return <Home />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
    </BrowserRouter>
  );
}