import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<any>(null);
  const [editSettings, setEditSettings] = useState(false);
  const [formData, setFormData] = useState({
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    buttonBorderRadius: '4px',
    buttonPadding: '0.5rem 1rem'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (isAdmin) {
      fetchSettings();
    }
  }, [user, navigate, isAdmin]);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setSettings(response.data);
      setFormData({
        primaryColor: response.data.primaryColor,
        secondaryColor: response.data.secondaryColor,
        fontFamily: response.data.fontFamily,
        buttonBorderRadius: response.data.buttonStyle.borderRadius,
        buttonPadding: response.data.buttonStyle.padding
      });
    } catch (err) {
      // Error fetching settings
    }
  };

  const handleUpdateSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/settings`, {
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        fontFamily: formData.fontFamily,
        buttonStyle: {
          borderRadius: formData.buttonBorderRadius,
          padding: formData.buttonPadding
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Apply settings to root
      document.documentElement.style.setProperty('--primary-color', formData.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', formData.secondaryColor);
      document.documentElement.style.setProperty('--font-family', formData.fontFamily);
      document.documentElement.style.setProperty('--button-border-radius', formData.buttonBorderRadius);
      document.documentElement.style.setProperty('--button-padding', formData.buttonPadding);
      
      setEditSettings(false);
      fetchSettings();
    } catch (err) {
      alert('Failed to update settings');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="container" style={{padding: "2rem", maxWidth: "800px"}}>
      <h1>Welcome, {user?.firstName}!</h1>
      
      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h2>User Profile</h2>
        <div style={{marginTop: '1rem'}}>
          <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
        </div>
      </div>

      {isAdmin && (
        <>
          <div style={{
            background: '#e3f2fd',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem',
            border: '2px solid #2196f3'
          }}>
            <h2>Admin Actions</h2>
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem',
              flexWrap: 'wrap'
            }}>
              <button 
                onClick={() => navigate('/admin/add-product')}
                className="btn"
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none'
                }}
              >
                Add Product
              </button>
              <button 
                onClick={() => navigate('/admin/add-gallery')}
                className="btn"
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none'
                }}
              >
                Add Gallery Item
              </button>
            </div>
          </div>

          <div style={{
            background: '#fff3cd',
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem',
            border: '2px solid #ffc107'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 style={{margin: 0}}>Site Styling</h2>
              <button 
                onClick={() => setEditSettings(!editSettings)}
                className="btn"
                style={{
                  background: '#ffc107',
                  color: 'black',
                  border: 'none'
                }}
              >
                {editSettings ? 'Cancel' : 'Edit Styling'}
              </button>
            </div>
            
            {editSettings ? (
              <div style={{marginTop: '1.5rem'}}>
                <div style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    style={{width: '100px', height: '40px', cursor: 'pointer'}}
                  />
                  <span style={{marginLeft: '1rem'}}>{formData.primaryColor}</span>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    Secondary Color
                  </label>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                    style={{width: '100px', height: '40px', cursor: 'pointer'}}
                  />
                  <span style={{marginLeft: '1rem'}}>{formData.secondaryColor}</span>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    Font Family
                  </label>
                  <select
                    value={formData.fontFamily}
                    onChange={(e) => setFormData({...formData, fontFamily: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                    <option value="Arial, Helvetica, sans-serif">Arial</option>
                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                    <option value="'Courier New', Courier, monospace">Courier New</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                  </select>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    Button Border Radius
                  </label>
                  <select
                    value={formData.buttonBorderRadius}
                    onChange={(e) => setFormData({...formData, buttonBorderRadius: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="0">Square (0)</option>
                    <option value="4px">Slightly Rounded (4px)</option>
                    <option value="8px">Rounded (8px)</option>
                    <option value="20px">Very Rounded (20px)</option>
                    <option value="50px">Pill Shape (50px)</option>
                  </select>
                </div>

                <div style={{marginBottom: '1rem'}}>
                  <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                    Button Padding
                  </label>
                  <select
                    value={formData.buttonPadding}
                    onChange={(e) => setFormData({...formData, buttonPadding: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="0.25rem 0.5rem">Small</option>
                    <option value="0.5rem 1rem">Medium</option>
                    <option value="0.75rem 1.5rem">Large</option>
                  </select>
                </div>

                <button 
                  onClick={handleUpdateSettings}
                  className="btn btn-primary"
                >
                  Save Styling
                </button>
              </div>
            ) : (
              <div style={{marginTop: '1rem'}}>
                <p><strong>Primary Color:</strong> <span style={{display: 'inline-block', width: '30px', height: '30px', background: settings?.primaryColor, border: '1px solid #ccc', verticalAlign: 'middle', marginLeft: '0.5rem'}}></span> {settings?.primaryColor}</p>
                <p><strong>Secondary Color:</strong> <span style={{display: 'inline-block', width: '30px', height: '30px', background: settings?.secondaryColor, border: '1px solid #ccc', verticalAlign: 'middle', marginLeft: '0.5rem'}}></span> {settings?.secondaryColor}</p>
                <p><strong>Font:</strong> {settings?.fontFamily}</p>
                <p><strong>Button Style:</strong> Border Radius: {settings?.buttonStyle?.borderRadius}, Padding: {settings?.buttonStyle?.padding}</p>
              </div>
            )}
          </div>
        </>
      )}

      <div style={{
        background: '#f8f9fa',
        padding: '1.5rem',
        borderRadius: '8px',
        marginTop: '2rem'
      }}>
        <h2>Quick Links</h2>
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '1rem',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate('/z-wishlist')}
            className="btn btn-primary"
          >
            View Wishlist
          </button>
          <button 
            onClick={() => navigate('/z-marketplace')}
            className="btn btn-primary"
          >
            View Marketplace
          </button>
          <button 
            onClick={() => navigate('/z-gallery')}
            className="btn btn-primary"
          >
            View Gallery
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="btn btn-primary"
          >
            Contact Us
          </button>
        </div>
      </div>

      <div style={{marginTop: '2rem'}}>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{
            background: '#dc3545',
            color: 'white',
            border: 'none'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
