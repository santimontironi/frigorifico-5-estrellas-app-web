import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { UserContextProvider } from "./context/UserContext";
import { ProductContextProvider } from "./context/ProductContext";
import { CategoryContextProvider } from "./context/CategoryContext";
import { CartContextProvider } from "./context/CartContext";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Confirm from "./pages/Confirm";
import ChangePassword from "./pages/ChangePassword";
import VerifyAuth from "./components/auth/VerifyAuth";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

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