import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} style={{ textDecoration: "none", color: "inherit" }}>
        {product.image ? (
          <img className="product-thumb" src={product.image} alt={product.name} />
        ) : (
          <div className="product-thumb placeholder" />
        )}
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.description}</p>
      </Link>

      <div className="product-footer">
        <span className="product-price">{product.price} ₪</span>
        <button onClick={() => addToCart(product)}>הוסף לעגלה</button>
      </div>
    </div>
  );
}
