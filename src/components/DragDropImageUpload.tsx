import React, { useState, useRef } from 'react';

interface DragDropImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({ value, onChange, label, required }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    // For now, just create a local URL - in production you'd upload to a server
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          {label} {required && '*'}
        </label>
      )}
      
      <div
        className={`drag-drop-box ${isDragging ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        
        {value ? (
          <div>
            <img 
              src={value} 
              alt="Preview" 
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
                marginBottom: '1rem'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Click or drag to change image
            </p>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>📁</p>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
              Drag & drop an image here, or click to select
            </p>
          </div>
        )}
      </div>
      
      <input
        type="url"
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />
    </div>
  );
};

export default DragDropImageUpload;
