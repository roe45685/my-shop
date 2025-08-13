import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/admin/users", { params: { q, page, limit: 20 }});
      setData(data);
    } catch (e) {
      alert(e.response?.data?.message || "שגיאה בטעינת משתמשים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, []);

  const remove = async (id) => {
    if (!confirm("למחוק משתמש זה?")) return;
    try {
      await api.delete(`/api/admin/users/${id}`);
      setData(s => ({ ...s, items: s.items.filter(u => u._id !== id), total: s.total - 1 }));
    } catch (e) {
      alert(e.response?.data?.message || "שגיאה במחיקה");
    }
  };

  return (
    <div className="page-wide">
      <h1>ניהול משתמשים</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="חפש לפי שם/אימייל" />
        <button onClick={()=>load(1)}>חפש</button>
        <Link className="btn btn-primary" to="/admin/users/new">+ יצירת משתמש</Link>
      </div>

      {loading ? <p>טוען...</p> : !data.items.length ? (
        <p>לא נמצאו משתמשים.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>Admin</th>
              <th>נוצר</th>
              <th style={{width:220}}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isAdmin ? "✔️" : "—"}</td>
                <td>{new Date(u.createdAt).toLocaleString()}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link className="btn btn-warning" to={`/admin/users/${u._id}/edit`}>ערוך</Link>
                    <button className="btn btn-danger" onClick={()=>remove(u._id)}>מחק</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* פגינציה פשוטה */}
      {data.pages > 1 && (
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
            <button key={p} disabled={p === data.page} onClick={()=>load(p)}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
