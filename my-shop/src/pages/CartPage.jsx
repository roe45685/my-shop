import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api";

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const placeOrder = async () => {
    setMsg("");

    if (!totalItems) return setMsg("העגלה ריקה");
    const token = localStorage.getItem("token");
    if (!token) {
      // לא מחובר → ננווט להתחברות
      return navigate("/login");
    }

    setLoading(true);
    try {
      const payload = {
        items: cart.map((it) => ({
          product: it.product._id,
          quantity: it.quantity,
        })),
      };
      const { data } = await api.post("/api/orders", payload); // interceptor יוסיף Authorization
      clearCart();
      setMsg("✅ ההזמנה בוצעה בהצלחה!");
      // מעבר להיסטוריית הזמנות
      navigate("/orders");
      console.log("Order created:", data);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setMsg("צריך להתחבר כדי לבצע הזמנה");
        navigate("/login");
      } else {
        setMsg(err.response?.data?.message || "שגיאה בביצוע הזמנה");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wide">
      <h1>העגלה שלי</h1>

      {!cart.length && <p>העגלה ריקה.</p>}

      {!!cart.length && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((it) => (
              <li key={it.product._id} className="cart-row">
                <div className="cart-info">
                  <strong>{it.product.name}</strong>
                  <span className="muted">{it.product.description}</span>
                </div>

                <div className="cart-controls">
                  <span className="price">{it.product.price} ₪</span>
                  <input
                    type="number"
                    min="1"
                    value={it.quantity}
                    onChange={(e) => updateQty(it.product._id, Number(e.target.value))}
                    disabled={loading}
                  />
                  <button className="secondary" onClick={() => removeFromCart(it.product._id)} disabled={loading}>
                    הסר
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div>סה״כ פריטים: <strong>{totalItems}</strong></div>
            <div>סה״כ לתשלום: <strong>{totalPrice} ₪</strong></div>
          </div>

          <div className="cart-actions">
            <button className="secondary" onClick={clearCart} disabled={loading}>נקה עגלה</button>
            <button onClick={placeOrder} disabled={loading || !cart.length}>
              {loading ? "מבצע הזמנה..." : "בצע הזמנה"}
            </button>
          </div>
        </>
      )}

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </div>
  );
}
