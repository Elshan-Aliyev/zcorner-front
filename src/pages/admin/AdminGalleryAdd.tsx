import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DragDropImageUpload from '../../components/DragDropImageUpload';

const AdminGalleryAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
    badge: '',
    badgeSize: '0.9rem',
    badgeColor: '#000000'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/gallery`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Gallery image added successfully!');
      setTimeout(() => navigate('/z-gallery'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add image');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1200px' }}>
      <h1>Add Gallery Image</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

            <DragDropImageUpload
              label="Image"
              value={formData.imageUrl}
              onChange={(value) => setFormData({ ...formData, imageUrl: value })}
              required
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Badge Text</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g., NEW, FEATURED"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Badge Size</label>
                <select
                  value={formData.badgeSize}
                  onChange={(e) => setFormData({ ...formData, badgeSize: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="0.7rem">Small</option>
                  <option value="0.9rem">Medium</option>
                  <option value="1.1rem">Large</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Badge Color</label>
                <input
                  type="color"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  style={{ width: '100%', padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc', height: '38px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Add Image
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/z-gallery')}
                className="btn"
                style={{ background: '#6c757d', color: 'white', border: 'none' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div style={{ 
          flex: '0 0 350px',
          position: 'sticky',
          top: '2rem',
          height: 'fit-content',
          border: '2px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          background: '#f8f9fa'
        }}>
          <h3 style={{ marginTop: 0 }}>Preview</h3>
          <div style={{
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            background: 'white'
          }}>
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                style={{ width: '100%', height: '250px', objectFit: 'contain', display: 'block' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/350x250?text=Invalid+Image'; }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '250px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#e9ecef',
                color: '#6c757d'
              }}>
                No image
              </div>
            )}
            
            {formData.badge && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: formData.badgeColor,
                color: 'white',
                padding: '0.5rem',
                borderRadius: '4px',
                fontSize: formData.badgeSize
              }}>
                {formData.badge}
              </div>
            )}
            
            {formData.title && (
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
                {formData.title}
              </div>
            )}
          </div>
          
          {formData.description && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '4px',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              {formData.description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryAdd;
