// src/pages/ProductsList.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [q, setQ]               = useState("");
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [limit]                 = useState(12); // שנה אם בא לך

  // בקשת נתונים מהשרת
  const fetchProducts = async (searchTerm = q, pageNum = page) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/products", {
        params: { q: searchTerm, page: pageNum, limit, sort: "createdAt", dir: "desc" }
      });
      setProducts(res.data.items || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "שגיאה בטעינת מוצרים");
    } finally {
      setLoading(false);
    }
  };

  // debounce: טוען אחרי 500ms מרגע ההקלדה / שינוי עמוד
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(q, page);
    }, 500);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, limit]);

  return (
    <div className="page">
      <h1>מוצרים</h1>

      {/* שדה חיפוש שלא מאבד פוקוס */}
      <input
        type="text"
        placeholder="חפש לפי שם או תיאור…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", maxWidth: 480 }}
      />

      {loading && <p>טוען מוצרים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && !products.length && <p>לא נמצאו מוצרים.</p>}

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {/* פגינציה */}
      {pages > 1 && (
        <div style={{ marginTop: "1rem", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>קודם</button>
          <span>עמוד {page} מתוך {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>הבא</button>
        </div>
      )}
    </div>
  );
}
