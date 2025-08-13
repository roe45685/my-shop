import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminAddUser() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/api/admin/users", { name, email, password, isAdmin });
      nav("/admin/users");
    } catch (e) {
      setMsg(e.response?.data?.message || "שגיאה ביצירת משתמש");
    }
  };

  return (
    <div className="page">
      <h1>יצירת משתמש</h1>
      <form className="form" onSubmit={submit}>
        <input placeholder="שם" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" placeholder="אימייל" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" placeholder="סיסמה" value={password} onChange={e=>setPassword(e.target.value)} required />
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)} />
          Admin
        </label>
        <button type="submit">צור</button>
      </form>
      {msg && <p style={{ marginTop: 8, color: 'red' }}>{msg}</p>}
    </div>
  );
}
