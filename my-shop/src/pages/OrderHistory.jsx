import { useEffect, useState } from "react";
import api from "../api";

function orderTotal(order) {
  return (order.items || []).reduce((sum, it) => {
    const price = it.product?.price || 0;
    const qty = it.quantity || 0;
    return sum + price * qty;
  }, 0);
}

function orderItemsCount(order) {
  return (order.items || []).reduce((n, it) => n + (it.quantity || 0), 0);
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/orders");
        // מיון מהחדש לישן
        setOrders(
          (Array.isArray(data) ? data : []).sort(
            (a, b) =>
              new Date(b.createdAt || b.updatedAt || 0) -
              new Date(a.createdAt || a.updatedAt || 0)
          )
        );
      } catch (e) {
        setErr(e.response?.data?.message || "שגיאה בטעינת ההזמנות");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="page"><p>טוען הזמנות...</p></div>;
  if (err) return <div className="page"><p style={{ color: "red" }}>{err}</p></div>;
  if (!orders.length) {
    return (
      <div className="page">
        <h1>היסטוריית הזמנות</h1>
        <p>אין הזמנות עדיין.</p>
      </div>
    );
  }

  return (
    <div className="page-wide">
      <h1>היסטוריית הזמנות</h1>
      <div className="hr"></div>

      <div style={{ display: "grid", gap: 14 }}>
        {orders.map((o) => (
          <div
            key={o._id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              background: "#fff",
              boxShadow: "0 6px 16px rgba(0,0,0,.05)",
            }}
          >
            {/* כותרת ההזמנה */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
                gap: 12,
                flexWrap: "wrap",
                alignItems: "baseline",
              }}
            >
              <div>
                <div><strong>מס׳ הזמנה:</strong> {o._id}</div>
                {o.customer?.name && (
                  <div style={{ fontSize: 14, color: "#555", marginTop: 2 }}>
                    <strong>מזמין:</strong> {o.customer.name}
                    {o.customer.email ? ` · ${o.customer.email}` : ""}
                  </div>
                )}
              </div>

              <div style={{ color: "#6b7280" }}>
                {new Date(o.createdAt || o.updatedAt || Date.now()).toLocaleString()}
              </div>

              <div style={{ marginLeft: "auto", fontWeight: 700 }}>
                <span style={{ marginInlineEnd: 10 }}>
                  פריטים: {orderItemsCount(o)}
                </span>
                <span>סה״כ: {orderTotal(o)} ₪</span>
              </div>
            </div>

            {/* פריטים בהזמנה */}
            <div style={{ display: "grid", gap: 8 }}>
              {(o.items || []).map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: "1px dashed #e5e7eb",
                  }}
                >
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {it.product?.name || "מוצר"}
                  </div>
                  <div style={{ textAlign: "right", color: "#6b7280" }}>x{it.quantity}</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>
                    {(it.product?.price || 0) * (it.quantity || 0)} ₪
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
