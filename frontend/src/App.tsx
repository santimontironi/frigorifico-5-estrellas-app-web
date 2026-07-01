import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ProductContextProvider } from "./context/ProductContext";
import AdminPanel from "./pages/AdminPanel";
import UserPanel from "./pages/UserPanel";
import AdminLogin from "./pages/AdminLogin";
import VerifyAuth from "./components/VerifyAuth";
import Home from "./pages/Home";

const App = () => {
  return (
    <AuthContextProvider>
      <ProductContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ingreso-admin" element={<AdminLogin />} />
            <Route path="/panel-admin" element={<VerifyAuth role="admin">
              <AdminPanel />
            </VerifyAuth>} />

            <Route path="/panel-usuario" element={<VerifyAuth role="user">
              <UserPanel />
            </VerifyAuth>} />
          </Routes>
        </BrowserRouter>
      </ProductContextProvider>
    </AuthContextProvider>
  )
}

export default App