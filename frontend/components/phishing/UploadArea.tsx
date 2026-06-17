'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, X } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (imageData: string) => void;
}

export default function UploadArea({ onImageUpload }: UploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const clearPreview = () => {
    setPreview(null);
    onImageUpload('');
  };

  if (preview) {
    return (
      <div className="upload-preview">
        <button className="clear-preview" onClick={clearPreview}>
          <X size={16} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={preview} alt="Screenshot preview" />
      </div>
    );
  }

  return (
    <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone-active' : ''}`}>
      <input {...getInputProps()} />
      <div className="dropzone-icon">
        <CloudUpload size={26} className="text-purple-light" />
      </div>
      <strong>Drag & drop your screenshot here</strong>
      <p>or click to browse</p>
      <div className="format-tags">
        <span className="format-tag">PNG</span>
        <span className="format-tag">JPG</span>
        <span className="format-tag">JPEG</span>
        <span className="format-tag">Max 10MB</span>
      </div>
    </div>
  );
}
