import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">Z-Corner</Link>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/z-wishlist">Wishlist</Link></li>
            <li><Link to="/z-marketplace">Marketplace</Link></li>
            <li><Link to="/z-gallery">Gallery</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <div className="auth-links">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
                {isAdmin && <Link to="/admin/add-product" className="btn btn-secondary">Add Product</Link>}
                <button onClick={logout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Login</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
