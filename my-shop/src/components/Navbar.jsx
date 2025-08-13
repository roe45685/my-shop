import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {/* עגלה תמיד מוצגת */}
        <Link to="/cart" className="cart-link" aria-label="Cart">
          <FaShoppingCart size={18} aria-hidden="true" />
          Cart
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </Link>



      </div>

      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="welcome-text">Welcome, {user.name}</span>
            {user?.isAdmin && <Link to="/admin/users">ניהול משתמשים</Link>}
            {user.isAdmin && <Link to="/admin/products">ניהול מוצרים</Link>}
          {user && <Link to="/orders">היסטוריית הזמנות</Link>}
          {user?.isAdmin && <Link to="/admin/orders">ניהול הזמנות אדמין</Link>}

            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout
            </button>
            <ThemeToggle />
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
