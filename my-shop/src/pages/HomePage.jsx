import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // נטען 6 מוצרים אחרונים להצגה בעמוד הבית
        const { data } = await api.get("/api/products", {
          params: { page: 1, limit: 6, sort: "createdAt", dir: "desc" },
        });
        setFeatured(Array.isArray(data.items) ? data.items : []);
      } catch (e) {
        // נשאיר featured ריק במקרה של שגיאה; אפשר גם להציג הודעה
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <h1>ברוכים הבאים ל־My Shop</h1>
          <p>מוצרים נבחרים, מחירים מעולים, קנייה קלה ובטוחה.</p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/products">למוצרים</Link>
            <Link className="btn btn-secondary" to="/register">התחל עכשיו</Link>
          </div>
        </div>
        <div className="hero-bg" />
      </section>

      {/* יתרונות/קטגוריות קצר */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-emoji">🚚</div>
          <h3>משלוח מהיר</h3>
          <p>קבלו את ההזמנה שלכם במהירות, עד הדלת.</p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">💳</div>
          <h3>תשלום מאובטח</h3>
          <p>קניה בטוחה עם הגנות ותקני אבטחה מחמירים.</p>
        </div>
        <div className="feature-card">
          <div className="feature-emoji">⭐</div>
          <h3>איכות נבדקת</h3>
          <p>רק מוצרים מומלצים ונבדקים בקפידה.</p>
        </div>
      </section>

      {/* מוצרים נבחרים */}
      <section className="home-section">
        <div className="home-section-head">
          <h2>מוצרים נבחרים</h2>
          <Link to="/products" className="link">לכל המוצרים ›</Link>
        </div>

        {loading ? (
          <p>טוען מוצרים…</p>
        ) : !featured.length ? (
          <p>עדיין אין מוצרים להצגה. חזור מאוחר יותר 🙂</p>
        ) : (
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* קריאה לפעולה תחתונה */}
      <section className="cta-wide">
        <h3>מוכנים לשדרג את החוויה?</h3>
        <p>התחברו כדי לעקוב אחרי הזמנות ולהנות מעגלת קניות חכמה.</p>
        <div className="cta-actions">
          <Link className="btn btn-primary" to="/login">התחברות</Link>
          <Link className="btn btn-secondary" to="/register">הרשמה</Link>
        </div>
      </section>
    </div>
  );
}
