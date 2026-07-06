import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { UserContextProvider } from "./context/UserContext";
import { ProductContextProvider } from "./context/ProductContext";
import { CategoryContextProvider } from "./context/CategoryContext";
import { CartContextProvider } from "./context/CartContext";
import AdminPanel from "./pages/admin/AdminPanel";
import UserPanel from "./pages/user/UserPanel";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Confirm from "./pages/auth/Confirm";
import ChangePassword from "./pages/auth/ChangePassword";
import VerifyAuth from "./components/auth/VerifyAuth";
import Contact from "./pages/public/Contact";
import AboutUs from "./pages/public/AboutUs";
import Home from "./pages/public/Home";
import Cart from "./pages/public/Cart";

const App = () => {
  return (
    <AuthContextProvider>
      <UserContextProvider>
      <ProductContextProvider>
        <CategoryContextProvider>
        <CartContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ingreso" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/confirmar/:token" element={<Confirm/>} />
            <Route path="/cambiar-clave/:token" element={<ChangePassword/>} />
            <Route path="/panel-admin" element={<VerifyAuth role="admin">
              <AdminPanel />
            </VerifyAuth>} />

            <Route path="/panel-usuario" element={<VerifyAuth role="user">
              <UserPanel />
            </VerifyAuth>} />

            <Route path="/contacto" element={<Contact />} />
            <Route path="/sobre-nosotros" element={<AboutUs />} />
            <Route path="/carrito" element={<Cart />} />
          </Routes>
        </BrowserRouter>
        </CartContextProvider>
        </CategoryContextProvider>
      </ProductContextProvider>
      </UserContextProvider>
    </AuthContextProvider>
  )
}

export default App