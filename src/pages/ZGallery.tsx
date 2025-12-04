import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StyleEditor, { SectionStyles } from '../components/StyleEditor';

const ZGallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sectionStyles, setSectionStyles] = useState<{[key: string]: SectionStyles}>({});
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGallery();
    fetchSettings();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`);
      setImages(response.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
      setSectionStyles(response.data.sectionStyles || {});
    } catch (err) {
      console.error('Error fetching settings:', err);
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
      console.error('Error updating section styles:', err);
    }
  };

  const getSectionStyle = (sectionId: string) => {
    return sectionStyles[sectionId] || {};
  };

  if (loading) return <div className="container" style={{padding: "2rem"}}>Loading...</div>;

  return (
    <div className="container" style={{padding: "2rem"}}>
      <div style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        position: 'relative',
        backgroundColor: getSectionStyle('gallery-header').backgroundColor,
        padding: '1.5rem',
        borderRadius: '8px'
      }}>
        <StyleEditor 
          sectionId="gallery-header"
          styles={getSectionStyle('gallery-header')}
          onSave={(styles) => handleSaveSectionStyles('gallery-header', styles)}
        />
        <div>
          <h1 style={{
            color: getSectionStyle('gallery-header').headerColor,
            fontSize: getSectionStyle('gallery-header').headerSize,
            fontWeight: getSectionStyle('gallery-header').headerWeight as any,
            margin: 0
          }}>Z-Gallery</h1>
          <p style={{
            color: getSectionStyle('gallery-header').textColor || '#666',
            fontSize: getSectionStyle('gallery-header').textSize,
            fontWeight: getSectionStyle('gallery-header').textWeight as any,
            margin: 0
          }}>Check out our photo collection!</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin/add-gallery')}
            className="btn btn-primary"
          >
            Add Images
          </button>
        )}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {images.length === 0 ? (
          <p>No gallery images yet.</p>
        ) : (
          images.map((image: any) => (
            <div 
              key={image._id} 
              style={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s'
              }}
              onClick={() => setSelectedImage(image)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img 
                src={image.imageUrl} 
                alt={image.title} 
                style={{width: '100%', height: '250px', objectFit: 'cover', display: 'block'}}
              />
              {image.badge && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: image.badgeColor || 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: image.badgeSize || '0.9rem'
                }}>
                  {image.badge}
                </div>
              )}
              {image.title && (
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '0.75rem',
                  fontSize: '0.9rem'
                }}>
                  {image.title}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{maxWidth: '90%', maxHeight: '90%', position: 'relative'}}>
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
            <img 
              src={selectedImage.imageUrl} 
              alt={selectedImage.title}
              style={{maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain'}}
            />
            {selectedImage.title && (
              <div style={{
                background: 'white',
                padding: '1rem',
                marginTop: '1rem',
                borderRadius: '4px'
              }}>
                <h3 style={{margin: '0 0 0.5rem 0'}}>{selectedImage.title}</h3>
                {selectedImage.description && (
                  <p style={{margin: 0, color: '#666'}}>{selectedImage.description}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ZGallery;
