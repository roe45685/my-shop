import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setMsg(""); setLoading(true);
    try {
      // ה-API מחזיר { items, total, page, pages }
      const { data } = await api.get("/api/products", { params: { page: 1, limit: 100 } });
      setProducts(Array.isArray(data.items) ? data.items : []);
    } catch (e) {
      setMsg(e.response?.data?.message || "שגיאה בטעינת מוצרים");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("למחוק את המוצר?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "שגיאה במחיקה");
    }
  };

  if (loading) return <div className="page"><p>טוען...</p></div>;

  return (
    <div className="page-wide">
      <h1>ניהול מוצרים</h1>
      <div className="admin-toolbar">
        <Link className="btn btn-primary" to="/admin/products/new">+ הוסף מוצר</Link>
      </div>

      {msg && <p className="alert error">{msg}</p>}

      {!products.length ? (
        <p>אין מוצרים.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>שם</th>
              <th>מחיר</th>
              <th>תיאור</th>
              <th style={{width:160}}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price} ₪</td>
                <td style={{maxWidth:400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                  {p.description}
                </td>
                <td>
                  <div style={{display:"flex", gap:8}}>
                    <Link className="btn btn-warning" to={`/admin/products/${p._id}/edit`}>ערוך</Link>
                    <button className="btn btn-danger" onClick={()=>remove(p._id)}>מחק</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
