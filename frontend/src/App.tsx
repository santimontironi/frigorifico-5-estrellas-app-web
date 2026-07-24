import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { AdminContextProvider } from "./context/AdminContext";
import { UserContextProvider } from "./context/UserContext";
import { ProductContextProvider } from "./context/ProductContext";
import { CategoryContextProvider } from "./context/CategoryContext";
import { OfferContextProvider } from "./context/OfferContext";
import { CartContextProvider } from "./context/CartContext";
import { OrderContextProvider } from "./context/OrderContext";
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
import PaymentSuccess from "./pages/public/PaymentSuccess";
import PaymentFailure from "./pages/public/PaymentFailure";
import PaymentPending from "./pages/public/PaymentPending";

const App = () => {
  return (
    <AuthContextProvider>
      <AdminContextProvider>
        <UserContextProvider>
          <ProductContextProvider>
            <CategoryContextProvider>
              <OfferContextProvider>
                <CartContextProvider>
                  <OrderContextProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/ingreso" element={<Login />} />
                        <Route path="/registro" element={<Register />} />
                        <Route path="/confirmar/:token" element={<Confirm />} />
                        <Route path="/cambiar-clave/:token" element={<ChangePassword />} />
                        <Route path="/panel-admin" element={<VerifyAuth roles={['admin', 'employee']}>
                          <AdminPanel />
                        </VerifyAuth>} />

                        <Route path="/panel-usuario" element={<VerifyAuth roles={['user']}>
                          <UserPanel />
                        </VerifyAuth>} />

                        <Route path="/contacto" element={<Contact />} />
                        <Route path="/sobre-nosotros" element={<AboutUs />} />
                        <Route path="/carrito" element={<Cart />} />
                        <Route path="/pago/exito" element={<PaymentSuccess />} />
                        <Route path="/pago/error" element={<PaymentFailure />} />
                        <Route path="/pago/pendiente" element={<PaymentPending />} />
                      </Routes>
                    </BrowserRouter>
                  </OrderContextProvider>
                </CartContextProvider>
              </OfferContextProvider>
            </CategoryContextProvider>
          </ProductContextProvider>
        </UserContextProvider>
      </AdminContextProvider>
    </AuthContextProvider>
  )
}

export default App