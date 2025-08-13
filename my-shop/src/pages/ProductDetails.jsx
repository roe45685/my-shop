import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "שגיאה בטעינת מוצר");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="page"><p>טוען...</p></div>;
  if (error)   return <div className="page"><p style={{color:'red'}}>{error}</p></div>;
  if (!product) return <div className="page"><p>מוצר לא נמצא</p></div>;

  return (
    <div className="page product-details">
      <div className="pd-left">
        {product.image ? (
          <img className="pd-image" src={product.image} alt={product.name} />
        ) : (
          <div className="pd-image placeholder" />
        )}
      </div>

      <div className="pd-right">
        <h1 className="pd-title">{product.name}</h1>
        <p className="pd-desc">{product.description}</p>
        <div className="pd-price">{product.price} ₪</div>

        <div className="pd-actions">
          <label>
            כמות:
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            />
          </label>
          <button onClick={() => addToCart(product, qty)}>הוסף לעגלה</button>
        </div>
      </div>
    </div>
  );
}
