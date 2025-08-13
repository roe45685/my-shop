import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setName(data.name || "");
        setPrice(data.price || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      } catch (e) {
        setMsg(e.response?.data?.message || "שגיאה בטעינת מוצר");
      } finally { setLoading(false); }
    })();
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.put(`/api/products/${id}`, {
        name, price: Number(price), description, image
      });
      setMsg("✅ נשמר בהצלחה");
      setTimeout(() => navigate("/admin/products"), 700);
    } catch (e) {
      setMsg(e.response?.data?.message || "שגיאה בשמירה");
    }
  };

  if (loading) return <div className="page"><p>טוען...</p></div>;

  return (
    <div className="page">
      <h1>עריכת מוצר</h1>
      <form className="form" onSubmit={submit}>
        <input placeholder="שם" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="number" placeholder="מחיר (₪)" value={price} onChange={e=>setPrice(e.target.value)} min="0" required />
        <input placeholder="תיאור" value={description} onChange={e=>setDescription(e.target.value)} required />
        <input type="url" placeholder="תמונה (URL)" value={image} onChange={e=>setImage(e.target.value)} />
        <button type="submit">שמור</button>
      </form>
      {msg && <p className="alert success" style={{marginTop:12}}>{msg}</p>}
    </div>
  );
}
