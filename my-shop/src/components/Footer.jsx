import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 className="footer-title">My Shop</h4>
            <p className="footer-text">
              קנייה קלה, בטוחה ומהירה — עם מוצרים נבחרים ומחירים הוגנים.
            </p>
          </div>

          <div className="footer-col">
            <h5 className="footer-subtitle">ניווט מהיר</h5>
            <ul className="footer-links">
              <li><Link to="/">דף הבית</Link></li>
              <li><Link to="/products">מוצרים</Link></li>
              <li><Link to="/cart">עגלה</Link></li>
              <li><Link to="/orders">היסטוריית הזמנות</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-subtitle">חשבון</h5>
            <ul className="footer-links">
              <li><Link to="/login">התחברות</Link></li>
              <li><Link to="/register">הרשמה</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5 className="footer-subtitle">צרו קשר</h5>
            <ul className="footer-links">
              <li><a href="mailto:support@myshop.com">support@myshop.com</a></li>
              <li>א-ו 09:00–18:00</li>
            </ul>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} My Shop. כל הזכויות שמורות.</span>
        </div>
      </div>
    </footer>
  );
}
