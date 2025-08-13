import { useEffect, useState } from "react";
import api from "../api";

const STATUS = ['pending', 'paid', 'shipped', 'canceled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true); setMsg("");
    try {
      const { data } = await api.get("/api/orders"); // כאדמין מחזיר את כולם
      const arr = Array.isArray(data) ? data : [];
      // מיון מהחדש לישן
      arr.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0));
      setOrders(arr);
    } catch (e) {
      setMsg(e.response?.data?.message || "שגיאה בטעינת ההזמנות");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (e) {
      alert(e.response?.data?.message || "שגיאה בעדכון סטטוס");
    }
  };

  const remove = async (id) => {
    if (!confirm("למחוק הזמנה זו?")) return;
    try {
      await api.delete(`/api/orders/${id}`);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || "שגיאה במחיקה");
    }
  };

  if (loading) return <div className="page"><p>טוען הזמנות...</p></div>;

  return (
    <div className="page-wide">
      <h1>ניהול הזמנות (Admin)</h1>
      {msg && <p style={{color:'red'}}>{msg}</p>}

      {!orders.length ? (
        <p>אין הזמנות.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>מס׳</th>
              <th>מזמין</th>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>פריטים</th>
              <th>סה״כ</th>
              <th style={{width:220}}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => {
              const total = (o.items||[]).reduce((s,it)=>s+(it.product?.price||0)*(it.quantity||0),0);
              const itemsCount = (o.items||[]).reduce((n,it)=>n+(it.quantity||0),0);
              return (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.customer?.name || '—'}</td>
                  <td>{new Date(o.createdAt||o.updatedAt||Date.now()).toLocaleString()}</td>
                  <td>
                    <select value={o.status} onChange={(e)=>setStatus(o._id, e.target.value)}>
                      {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{itemsCount}</td>
                  <td>{total} ₪</td>
                  <td>
                    <button className="btn btn-danger" onClick={()=>remove(o._id)}>מחק</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
