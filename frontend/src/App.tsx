import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ProductContextProvider } from "./context/ProductContext";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";
import Login from "./pages/Login";
import VerifyAuth from "./components/auth/VerifyAuth";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";

const App = () => {
  return (
    <AuthContextProvider>
      <ProductContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ingreso" element={<Login />} />
            <Route path="/panel-admin" element={<VerifyAuth role="admin">
              <AdminPanel />
            </VerifyAuth>} />

            <Route path="/panel-usuario" element={<VerifyAuth role="user">
              <UserPanel />
            </VerifyAuth>} />

            <Route path="/contacto" element={<Contact />} />
            <Route path="/sobre-nosotros" element={<AboutUs />} />
          </Routes>
        </BrowserRouter>
      </ProductContextProvider>
    </AuthContextProvider>
  )
}

export default App