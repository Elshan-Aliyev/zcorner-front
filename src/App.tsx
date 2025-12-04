import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ZWishlist from './pages/ZWishlist';
import ZMarketplace from './pages/ZMarketplace';
import ZGallery from './pages/ZGallery';
import Contact from './pages/Contact';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import AdminProductAdd from './pages/admin/AdminProductAdd';
import AdminProductEdit from './pages/admin/AdminProductEdit';
import AdminGalleryAdd from './pages/admin/AdminGalleryAdd';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      const settings = response.data;
      
      // Apply CSS variables
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
      document.documentElement.style.setProperty('--font-family', settings.fontFamily);
      document.documentElement.style.setProperty('--button-border-radius', settings.buttonStyle.borderRadius);
      document.documentElement.style.setProperty('--button-padding', settings.buttonStyle.padding);
      
      setSettingsLoaded(true);
    } catch (err) {
      setSettingsLoaded(true); // Still load the app with defaults
    }
  };

  if (!settingsLoaded) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading...</div>;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/z-wishlist" element={<ZWishlist />} />
              <Route path="/z-marketplace" element={<ZMarketplace />} />
              <Route path="/z-gallery" element={<ZGallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin/add-product" element={<AdminProductAdd />} />
              <Route path="/admin/edit-product/:id" element={<AdminProductEdit />} />
              <Route path="/admin/add-gallery" element={<AdminGalleryAdd />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
