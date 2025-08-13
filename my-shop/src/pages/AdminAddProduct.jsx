import { useState } from "react";
import api from "../api"; // axios עם baseURL + Authorization מה-localStorage

export default function AdminAddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setLoading(true);
    try {
      await api.post("/api/products", {
        name,
        price: Number(price),
        description,
        image
      });
      setMsg("✅ המוצר נוסף בהצלחה");
      setName(""); setPrice(""); setDescription(""); setImage("");
    } catch (err) {
      setMsg(err.response?.data?.message || "שגיאה בהוספת מוצר");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <h1>הוספת מוצר (Admin)</h1>
      <form onSubmit={submit} className="form">
        <input placeholder="שם המוצר" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="number" placeholder="מחיר (₪)" value={price} onChange={e=>setPrice(e.target.value)} required min="0" />
        <input placeholder="תיאור" value={description} onChange={e=>setDescription(e.target.value)} required />
        <input type="url" placeholder="קישור לתמונה (אופציונלי)" value={image} onChange={e=>setImage(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "מוסיף..." : "הוסף מוצר"}</button>
      </form>
      {msg && <p style={{marginTop:12}}>{msg}</p>}
    </div>
  );
}
