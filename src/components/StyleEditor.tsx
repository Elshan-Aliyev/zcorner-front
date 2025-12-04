import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface StyleEditorProps {
  sectionId: string;
  styles: SectionStyles;
  onSave: (styles: SectionStyles) => void;
}

export interface SectionStyles {
  backgroundColor?: string;
  headerColor?: string;
  headerSize?: string;
  headerWeight?: string;
  textColor?: string;
  textSize?: string;
  textWeight?: string;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ styles, onSave }) => {
  const { isAdmin } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [editStyles, setEditStyles] = useState<SectionStyles>(styles);

  if (!isAdmin) return null;

  const handleSave = () => {
    onSave(editStyles);
    setShowPopup(false);
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.6)',
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
          zIndex: 10,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,123,255,0.8)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.6)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Edit Section Styling"
      >
        ✏️
      </button>

      {showPopup && (
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
        }} onClick={() => setShowPopup(false)}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{marginTop: 0}}>Edit Section Styling</h2>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Background Color
              </label>
              <input
                type="color"
                value={editStyles.backgroundColor || '#ffffff'}
                onChange={(e) => setEditStyles({...editStyles, backgroundColor: e.target.value})}
                style={{width: '100px', height: '40px', cursor: 'pointer'}}
              />
              <span style={{marginLeft: '1rem'}}>{editStyles.backgroundColor}</span>
            </div>

            <h3 style={{marginTop: '1.5rem', marginBottom: '1rem'}}>Header Styling</h3>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Header Color
              </label>
              <input
                type="color"
                value={editStyles.headerColor || '#000000'}
                onChange={(e) => setEditStyles({...editStyles, headerColor: e.target.value})}
                style={{width: '100px', height: '40px', cursor: 'pointer'}}
              />
              <span style={{marginLeft: '1rem'}}>{editStyles.headerColor}</span>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Header Size
              </label>
              <select
                value={editStyles.headerSize || '2rem'}
                onChange={(e) => setEditStyles({...editStyles, headerSize: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="1.5rem">Small (1.5rem)</option>
                <option value="2rem">Medium (2rem)</option>
                <option value="2.5rem">Large (2.5rem)</option>
                <option value="3rem">Extra Large (3rem)</option>
              </select>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Header Weight
              </label>
              <select
                value={editStyles.headerWeight || '700'}
                onChange={(e) => setEditStyles({...editStyles, headerWeight: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
              </select>
            </div>

            <h3 style={{marginTop: '1.5rem', marginBottom: '1rem'}}>Text Styling</h3>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Text Color
              </label>
              <input
                type="color"
                value={editStyles.textColor || '#666666'}
                onChange={(e) => setEditStyles({...editStyles, textColor: e.target.value})}
                style={{width: '100px', height: '40px', cursor: 'pointer'}}
              />
              <span style={{marginLeft: '1rem'}}>{editStyles.textColor}</span>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Text Size
              </label>
              <select
                value={editStyles.textSize || '1rem'}
                onChange={(e) => setEditStyles({...editStyles, textSize: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="0.875rem">Small (0.875rem)</option>
                <option value="1rem">Medium (1rem)</option>
                <option value="1.1rem">Large (1.1rem)</option>
                <option value="1.25rem">Extra Large (1.25rem)</option>
              </select>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: 'bold'}}>
                Text Weight
              </label>
              <select
                value={editStyles.textWeight || '400'}
                onChange={(e) => setEditStyles({...editStyles, textWeight: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi-Bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
              <button 
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save Styling
              </button>
              <button 
                onClick={() => setShowPopup(false)}
                className="btn"
                style={{background: '#6c757d', color: 'white', border: 'none'}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StyleEditor;
