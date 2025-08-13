import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminEditUser() {
  const { id } = useParams();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState(""); 
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/admin/users", { params: { q: email, page: 1, limit: 1 }});
       
        const user = (await api.get(`/api/admin/users`, { params: { q: id } })).data.items?.find(u=>u._id===id);
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setIsAdmin(!!user.isAdmin);
        } else {
          setMsg("משתמש לא נמצא");
        }
      } catch (e) {
        setMsg(e.response?.data?.message || "שגיאה בטעינת משתמש");
      } finally { setLoading(false); }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = { name, email, isAdmin };
      if (password) payload.password = password; // יעדכן סיסמה אם נשלח
      await api.put(`/api/admin/users/${id}`, payload);
      nav("/admin/users");
    } catch (e) {
      setMsg(e.response?.data?.message || "שגיאה בעדכון");
    }
  };

  if (loading) return <div className="page"><p>טוען...</p></div>;

  return (
    <div className="page">
      <h1>עריכת משתמש</h1>
      <form className="form" onSubmit={submit}>
        <input placeholder="שם" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" placeholder="אימייל" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)} />
          Admin
        </label>
        <input type="password" placeholder="סיסמה (להשאיר ריק אם לא משנים)" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">שמור</button>
      </form>
      {msg && <p style={{ marginTop: 8, color: 'red' }}>{msg}</p>}
    </div>
  );
}
