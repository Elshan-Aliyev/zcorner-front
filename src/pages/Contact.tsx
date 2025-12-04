import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StyleEditor, { SectionStyles } from '../components/StyleEditor';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    type: 'general'
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sectionStyles, setSectionStyles] = useState<{[key: string]: SectionStyles}>({});
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/settings');
      setSectionStyles(response.data.sectionStyles || {});
    } catch (err) {
      console.error('Error fetching settings:', err);
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
      console.error('Error updating section styles:', err);
    }
  };

  const getSectionStyle = (sectionId: string) => {
    return sectionStyles[sectionId] || {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setSuccess('Message sent successfully! We will get back to you soon.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        type: 'general'
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{padding: "2rem", maxWidth: "800px"}}>
      <div style={{
        position: 'relative',
        backgroundColor: getSectionStyle('contact-header').backgroundColor,
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <StyleEditor 
          sectionId="contact-header"
          styles={getSectionStyle('contact-header')}
          onSave={(styles) => handleSaveSectionStyles('contact-header', styles)}
        />
        <h1 style={{
          color: getSectionStyle('contact-header').headerColor,
          fontSize: getSectionStyle('contact-header').headerSize,
          fontWeight: getSectionStyle('contact-header').headerWeight as any,
          margin: '0 0 0.5rem 0'
        }}>Contact Us</h1>
        <p style={{
          marginBottom: "0",
          color: getSectionStyle('contact-header').textColor || '#666',
          fontSize: getSectionStyle('contact-header').textSize,
          fontWeight: getSectionStyle('contact-header').textWeight as any
        }}>
          Have a question or want to make a trade offer? Send us a message!
        </p>
      </div>

      {success && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
            Message Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          >
            <option value="general">General Inquiry</option>
            <option value="trade">Trade Offer</option>
            <option value="support">Support</option>
          </select>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
              First Name *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
          </div>
        </div>

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <div style={{marginBottom: '1rem'}}>
          <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
            Message *
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            required
            rows={6}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Contact;
