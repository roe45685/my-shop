import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Footer from "./components/Footer";
import RequireAdmin from "./components/RequireAdmin";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductsList from "./pages/ProductsList";
import ProductDetails from "./pages/ProductDetails";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import CartPage from "./pages/CartPage";
import RequireAuth from "./components/RequireAuth";
import OrderHistory from "./pages/OrderHistory";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminAddUser from "./pages/AdminAddUser";
import AdminEditUser from "./pages/AdminEditUser";
import "./styles/global.css";



function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsList />} /> {/* חדש */}
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin/products"element={<RequireAdmin><AdminProducts /></RequireAdmin> }/>
            <Route path="/admin/products/new"element={<RequireAdmin><AdminAddProduct /></RequireAdmin>}/>
            <Route path="/admin/products/:id/edit"element={<RequireAdmin><AdminEditProduct /></RequireAdmin>}/>
            <Route path="/orders"element={<RequireAuth><OrderHistory /></RequireAuth>}/>
            <Route path="/admin/orders"element={<RequireAdmin><AdminOrders /></RequireAdmin>}/>
            <Route path="/admin/users"element={<RequireAdmin><AdminUsers /></RequireAdmin>}/>
<Route path="/admin/users/new"element={<RequireAdmin><AdminAddUser /></RequireAdmin>}/>
<Route path="/admin/users/:id/edit"element={<RequireAdmin><AdminEditUser /></RequireAdmin>}/>
            
          </Routes>
           <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
export default App;
