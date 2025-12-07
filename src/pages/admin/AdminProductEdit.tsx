import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import DragDropImageUpload from '../../components/DragDropImageUpload';

const AdminProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productLink: '',
    title: '',
    price: '',
    description: '',
    mainImage: '',
    additionalImages: ['', '', ''],
    page: 'wishlist',
    buyNowLink: '',
    buttons: {
      addToCart: false,
      view: false,
      giftCard: false,
      donate: false,
      buyNow: false,
      tradeOffer: false
    }
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const product = response.data;
      setFormData({
        productLink: product.productLink || '',
        title: product.title,
        price: product.price.toString(),
        description: product.description,
        mainImage: product.mainImage,
        additionalImages: product.additionalImages.length > 0 
          ? product.additionalImages 
          : ['', '', ''],
        page: product.page,
        buyNowLink: product.buyNowLink || '',
        buttons: product.buttons
      });
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load product');
      setLoading(false);
    }
  };

  const handleAddImageField = () => {
    setFormData({
      ...formData,
      additionalImages: [...formData.additionalImages, '']
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.additionalImages];
    newImages[index] = value;
    setFormData({ ...formData, additionalImages: newImages });
  };

  const handleButtonToggle = (buttonName: string) => {
    setFormData({
      ...formData,
      buttons: {
        ...formData.buttons,
        [buttonName]: !formData.buttons[buttonName as keyof typeof formData.buttons]
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        productLink: formData.productLink,
        mainImage: formData.mainImage,
        additionalImages: formData.additionalImages.filter(img => img.trim() !== ''),
        page: formData.page,
        buyNowLink: formData.buyNowLink,
        buttons: formData.buttons
      };

      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Product deleted successfully! Redirecting...');
      // Navigate to the appropriate page based on where the product was
      const targetPage = formData.page === 'marketplace' ? '/z-marketplace' : '/z-wishlist';
      setTimeout(() => navigate(targetPage), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1200px' }}>
      <h1>Edit Product</h1>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
        {/* Form Section */}
        <div style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
            {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Product Link</label>
              <input
                type="url"
                value={formData.productLink}
                onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <DragDropImageUpload
              label="Main Image"
              value={formData.mainImage}
              onChange={(value) => setFormData({ ...formData, mainImage: value })}
              required
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Additional Images</label>
              {formData.additionalImages.map((img, index) => (
                <DragDropImageUpload
                  key={index}
                  label={`Image ${index + 1}`}
                  value={img}
                  onChange={(value) => handleImageChange(index, value)}
                />
              ))}
              <button
                type="button"
                onClick={handleAddImageField}
                className="btn"
                style={{ background: '#6c757d', color: 'white', border: 'none' }}
              >
                Add More Images
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Choose Page *</label>
              <div>
                <label style={{ marginRight: '1rem' }}>
                  <input
                    type="radio"
                    value="wishlist"
                    checked={formData.page === 'wishlist'}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  />
                  {' '}Z-Wishlist
                </label>
                <label>
                  <input
                    type="radio"
                    value="marketplace"
                    checked={formData.page === 'marketplace'}
                    onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  />
                  {' '}Z-Marketplace
                </label>
              </div>
            </div>

            {formData.page === 'marketplace' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Buy Now Link (for marketplace)</label>
                <input
                  type="url"
                  value={formData.buyNowLink}
                  onChange={(e) => setFormData({ ...formData, buyNowLink: e.target.value })}
                  placeholder="Enter custom buy now link"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Leave empty to use default Square checkout link
                </small>
              </div>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Buttons to Include</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.buttons.addToCart}
                    onChange={() => handleButtonToggle('addToCart')}
                    disabled={formData.page === 'marketplace'}
                  />
                  {' '}Add to Cart
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.buttons.view}
                    onChange={() => handleButtonToggle('view')}
                    disabled={formData.page === 'marketplace'}
                  />
                  {' '}View
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.buttons.giftCard}
                    onChange={() => handleButtonToggle('giftCard')}
                  />
                  {' '}Gift Card
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={formData.buttons.donate}
                    onChange={() => handleButtonToggle('donate')}
                  />
                  {' '}Donate
                </label>
                {formData.page === 'marketplace' && (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.buttons.buyNow}
                        onChange={() => handleButtonToggle('buyNow')}
                      />
                      {' '}Buy Now
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.buttons.tradeOffer}
                        onChange={() => handleButtonToggle('tradeOffer')}
                      />
                      {' '}Trade Offer
                    </label>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Update Product
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')}
                className="btn"
                style={{ background: '#6c757d', color: 'white', border: 'none' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleDelete}
                className="btn"
                style={{ background: '#dc3545', color: 'white', border: 'none' }}
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div style={{ 
          flex: '0 0 300px',
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
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '1rem',
            background: 'white'
          }}>
            {formData.mainImage && (
              <img 
                src={formData.mainImage} 
                alt="Preview" 
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Invalid+Image'; }}
              />
            )}
            <h4 style={{ marginTop: '0.5rem' }}>{formData.title || 'Product Title'}</h4>
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
              ${formData.price || '0.00'}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              {formData.description || 'Product description will appear here...'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {formData.buttons.addToCart && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#007bff', color: 'white', borderRadius: '3px' }}>Add to Cart</span>}
              {formData.buttons.view && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#6c757d', color: 'white', borderRadius: '3px' }}>View</span>}
              {formData.buttons.giftCard && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#ffc107', color: 'black', borderRadius: '3px' }}>Gift Card</span>}
              {formData.buttons.donate && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#28a745', color: 'white', borderRadius: '3px' }}>Donate</span>}
              {formData.buttons.buyNow && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#dc3545', color: 'white', borderRadius: '3px' }}>Buy Now</span>}
              {formData.buttons.tradeOffer && <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#17a2b8', color: 'white', borderRadius: '3px' }}>Trade Offer</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
