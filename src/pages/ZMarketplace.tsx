import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StyleEditor, { SectionStyles } from '../components/StyleEditor';

const ZMarketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionStyles, setSectionStyles] = useState<{[key: string]: SectionStyles}>({});
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchSettings();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?page=marketplace');
      setProducts(response.data);
    } catch (err) {
      // Error fetching marketplace
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSectionStyles(response.data.sectionStyles || {});
    } catch (err) {
      // Error fetching settings
    }
  };

  const handleSaveSectionStyles = async (sectionId: string, styles: SectionStyles) => {
    try {
      const token = localStorage.getItem('token');
      const updatedStyles = { ...sectionStyles, [sectionId]: styles };
      await axios.put('http://localhost:5000/api/settings', 
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

  if (loading) return <div className="container" style={{padding: "2rem"}}>Loading...</div>;

  return (
    <div className="container" style={{padding: "2rem"}}>
      <div style={{
        textAlign: 'center', 
        marginBottom: '3rem',
        position: 'relative',
        backgroundColor: getSectionStyle('marketplace-header').backgroundColor,
        padding: '2rem',
        borderRadius: '8px'
      }}>
        <StyleEditor 
          sectionId="marketplace-header"
          styles={getSectionStyle('marketplace-header')}
          onSave={(styles) => handleSaveSectionStyles('marketplace-header', styles)}
        />
        <h1 style={{
          color: getSectionStyle('marketplace-header').headerColor,
          fontSize: getSectionStyle('marketplace-header').headerSize,
          fontWeight: getSectionStyle('marketplace-header').headerWeight as any
        }}>Welcome to Z-Market</h1>
        <h2 style={{
          color: getSectionStyle('marketplace-header').textColor || '#666',
          fontSize: getSectionStyle('marketplace-header').textSize || '1.3rem',
          fontWeight: getSectionStyle('marketplace-header').textWeight as any,
          marginTop: '0.5rem'
        }}>
          A place to buy, sell, or trade cool stuff I have — and give them a second life! 🛒
        </h2>
        <p style={{
          fontSize: getSectionStyle('marketplace-header').textSize || '1.1rem',
          color: getSectionStyle('marketplace-header').textColor || '#666',
          fontWeight: getSectionStyle('marketplace-header').textWeight as any,
          marginTop: '1rem'
        }}>
          Some things I've outgrown, others I just want to share.
        </p>
        <p style={{
          fontWeight: getSectionStyle('marketplace-header').textWeight || 'bold',
          marginTop: '1rem',
          color: getSectionStyle('marketplace-header').textColor || '#333',
          fontSize: getSectionStyle('marketplace-header').textSize
        }}>
          Take a look around, and who knows — you might find something totally awesome! ✨
        </p>
      </div>
      
      <div className="grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {products.length === 0 ? (
          <p>No marketplace items yet.</p>
        ) : (
          products.map((item: any) => (
            <div key={item._id} className="card" style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
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
              <img 
                src={item.mainImage} 
                alt={item.title} 
                style={{width: '100%', height: '200px', objectFit: 'cover'}}
              />
              <div style={{padding: '1rem'}}>
                <h3 style={{margin: '0 0 0.5rem 0'}}>{item.title}</h3>
                <p style={{color: '#28a745', fontWeight: 'bold', margin: '0.5rem 0'}}>
                  ${item.price.toFixed(2)}
                </p>
                <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '1rem'}}>
                  {item.description}
                </p>
                <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                  {item.buttons?.buyNow && (
                    <a 
                      href={item.buyNowLink || `https://checkout.square.site/merchant/MLMN1BMR2GGD9/checkout/JU7GEJPP7QP4K23FYYQAJFCU`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px'}}
                    >
                      Buy Now
                    </a>
                  )}
                  {item.buttons?.tradeOffer && (
                    <a 
                      href="/contact?type=trade"
                      className="btn"
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px'}}
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
                      style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem', textDecoration: 'none', background: '#ffc107', color: 'black', border: 'none', borderRadius: '4px'}}
                    >
                      Gift Card
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ZMarketplace;
