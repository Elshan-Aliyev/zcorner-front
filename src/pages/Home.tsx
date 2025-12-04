import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import StyleEditor, { SectionStyles } from '../components/StyleEditor';
import DragDropImageUpload from '../components/DragDropImageUpload';
import './Home.css';

const Home = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [heroImage, setHeroImage] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [newHeroImage, setNewHeroImage] = useState('');
  const [sectionStyles, setSectionStyles] = useState<{[key: string]: SectionStyles}>({});
  const [primaryColor, setPrimaryColor] = useState('#007bff');
  const [scrollY, setScrollY] = useState(0);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchSettings();
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchItems = async () => {
    try {
      const wishlist = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?page=wishlist&limit=6`);
      const marketplace = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?page=marketplace&limit=6`);
      setWishlistItems(wishlist.data);
      setMarketplaceItems(marketplace.data);
    } catch (err) {
      // Error fetching items
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setHeroImage(response.data.heroImage);
      setNewHeroImage(response.data.heroImage);
      setSectionStyles(response.data.sectionStyles || {});
      setPrimaryColor(response.data.primaryColor || '#007bff');
    } catch (err) {
      // Error fetching settings
    }
  };

  const handleUpdateHeroImage = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, 
        { heroImage: newHeroImage },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setHeroImage(newHeroImage);
      setShowEditModal(false);
    } catch (err) {
      alert('Failed to update hero image');
    }
  };

  const handleSaveSectionStyles = async (sectionId: string, styles: SectionStyles) => {
    try {
      const token = localStorage.getItem('token');
      const updatedStyles = { ...sectionStyles, [sectionId]: styles };
      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, 
        { sectionStyles: updatedStyles },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setSectionStyles(updatedStyles);
    } catch (err) {
      alert('Failed to save section styles');
    }
  };

  const getSectionStyle = (sectionId: string) => {
    return sectionStyles[sectionId] || {};
  };

  return (
    <div className="home">
      {isAdmin && (
        <div style={{
          background: '#f8f9fa',
          padding: '1rem',
          textAlign: 'center',
          borderBottom: '1px solid #ddd'
        }}>
          <button 
            onClick={() => setShowEditModal(true)}
            className="btn btn-primary"
            style={{fontSize: '0.9rem'}}
          >
            Edit Hero Image
          </button>
        </div>
      )}

      <section className="hero" style={{
        backgroundImage: heroImage 
          ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`
          : 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#000',
        position: 'relative',
        height: '100vh',
        minHeight: '600px',
        transform: `translateY(${scrollY * 0.5}px)`
      }}>
        <StyleEditor 
          sectionId="hero"
          styles={getSectionStyle('hero')}
          onSave={(styles) => handleSaveSectionStyles('hero', styles)}
        />
        <div className="hero-content">
          <h1 style={{
            color: getSectionStyle('hero').headerColor,
            fontSize: getSectionStyle('hero').headerSize,
            fontWeight: getSectionStyle('hero').headerWeight as any
          }}>Welcome to My World of Wishes & Adventures!</h1>
          <p style={{
            color: getSectionStyle('hero').textColor,
            fontSize: getSectionStyle('hero').textSize,
            fontWeight: getSectionStyle('hero').textWeight as any
          }}>Discover my favorite things, dream trips, and cool stuff I'd love to share.</p>
        </div>
      </section>

      {showEditModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{marginTop: 0}}>Edit Hero Image</h2>
            <DragDropImageUpload
              label="Hero Background Image"
              value={newHeroImage}
              onChange={setNewHeroImage}
              required
            />
            <div style={{display: 'flex', gap: '1rem'}}>
              <button 
                onClick={handleUpdateHeroImage}
                className="btn btn-primary"
              >
                Update
              </button>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setNewHeroImage(heroImage);
                }}
                className="btn"
                style={{background: '#6c757d', color: 'white', border: 'none'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Divider before wishlist */}
        <div style={{
          height: '4px',
          background: primaryColor,
          marginTop: '3rem',
          marginBottom: '2rem'
        }}></div>

        <section className="home-section" style={{
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: getSectionStyle('wishlist').backgroundColor,
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <StyleEditor 
              sectionId="wishlist"
              styles={getSectionStyle('wishlist')}
              onSave={(styles) => handleSaveSectionStyles('wishlist', styles)}
            />
            <h2 style={{
              color: getSectionStyle('wishlist').headerColor,
              fontSize: getSectionStyle('wishlist').headerSize,
              fontWeight: getSectionStyle('wishlist').headerWeight as any
            }}>🌟 Z-Wishlist</h2>
            <p style={{
              fontSize: getSectionStyle('wishlist').textSize || '1.1rem',
              color: getSectionStyle('wishlist').textColor || '#666',
              fontWeight: getSectionStyle('wishlist').textWeight as any,
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              All Z Things I Dream Of!
            </p>
            
            {/* Divider after text */}
            <div style={{
              height: '3px',
              background: primaryColor,
              marginBottom: '0'
            }}></div>
          </div>
          
          <div className="grid">
            {wishlistItems.map((item: any) => (
              <div key={item._id} className="card" style={{ position: 'relative' }}>
                {isAdmin && (
                  <button
                    onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,123,255,0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 5,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,123,255,1)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,123,255,0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Edit Product"
                  >
                    ✏️
                  </button>
                )}
                <img src={item.mainImage} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="price">${item.price}</p>
                <p className="description">{item.description}</p>
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                  {item.buttons?.addToCart && (
                    <button 
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: '#007bff', color: 'white', border: 'none'}}
                    >
                      Add to Cart
                    </button>
                  )}
                  {item.buttons?.view && item.productLink && (
                    <a 
                      href={item.productLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#6c757d', color: 'white', border: 'none'}}
                    >
                      View
                    </a>
                  )}
                  {item.buttons?.giftCard && (
                    <a 
                      href={`https://www.amazon.ca/dp/B07P68FH74?gpo=${parseFloat(item.price).toFixed(2)}&th=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#ffc107', color: 'black', border: 'none'}}
                    >
                      Gift Card
                    </a>
                  )}
                  {item.buttons?.donate && (
                    <a 
                      href="https://checkout.square.site/merchant/MLMN1BMR2GGD9/checkout/JU7GEJPP7QP4K23FYYQAJFCU"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#28a745', color: 'white', border: 'none'}}
                    >
                      Donate
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link to="/z-wishlist" className="btn btn-primary view-more-btn">View More</Link>
        </section>

        {/* Divider before marketplace */}
        <div style={{
          height: '4px',
          background: primaryColor,
          marginTop: '3rem',
          marginBottom: '2rem'
        }}></div>

        <section className="home-section" style={{
          position: 'relative'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: getSectionStyle('marketplace').backgroundColor,
            padding: '2rem',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <StyleEditor 
              sectionId="marketplace"
              styles={getSectionStyle('marketplace')}
              onSave={(styles) => handleSaveSectionStyles('marketplace', styles)}
            />
            <h2 style={{
              color: getSectionStyle('marketplace').headerColor,
              fontSize: getSectionStyle('marketplace').headerSize,
              fontWeight: getSectionStyle('marketplace').headerWeight as any
            }}>🛒 Z-Market</h2>
            <p style={{
              fontSize: getSectionStyle('marketplace').textSize || '1.1rem',
              color: getSectionStyle('marketplace').textColor || '#666',
              fontWeight: getSectionStyle('marketplace').textWeight as any,
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              My Mini Store & Trade Zone<br/>
              Sometimes I outgrow my stuff or find treasures to swap — take a look!
            </p>
            
            {/* Divider after text */}
            <div style={{
              height: '3px',
              background: primaryColor,
              marginBottom: '0'
            }}></div>
          </div>
          
          <div className="grid">
            {marketplaceItems.map((item: any) => (
              <div key={item._id} className="card" style={{ position: 'relative' }}>
                {isAdmin && (
                  <button
                    onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0,123,255,0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '35px',
                      height: '35px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 5,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,123,255,1)';
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,123,255,0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                    title="Edit Product"
                  >
                    ✏️
                  </button>
                )}
                <img src={item.mainImage} alt={item.title} />
                <h3>{item.title}</h3>
                <p className="price">${item.price}</p>
                <p className="description">{item.description}</p>
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem'}}>
                  {item.buttons?.buyNow && (
                    <a 
                      href={item.buyNowLink || `https://checkout.square.site/merchant/MLMN1BMR2GGD9/checkout/JU7GEJPP7QP4K23FYYQAJFCU`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#dc3545', color: 'white', border: 'none'}}
                    >
                      Buy Now
                    </a>
                  )}
                  {item.buttons?.tradeOffer && (
                    <a 
                      href="/contact?type=trade"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#17a2b8', color: 'white', border: 'none'}}
                    >
                      Trade Offer
                    </a>
                  )}
                  {item.buttons?.giftCard && (
                    <a 
                      href={`https://www.amazon.ca/dp/B07P68FH74?gpo=${parseFloat(item.price).toFixed(2)}&th=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#ffc107', color: 'black', border: 'none'}}
                    >
                      Gift Card
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Link to="/z-marketplace" className="btn btn-primary view-more-btn">View More</Link>
        </section>
      </div>
    </div>
  );
};

export default Home;
