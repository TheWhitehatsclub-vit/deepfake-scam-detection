'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, X, AlertCircle } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (imageData: string) => void;
  onFileSelect?: (file: File | null) => void;
}

export default function UploadArea({ onImageUpload, onFileSelect }: UploadAreaProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError(null);
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError('File size exceeds 200MB limit');
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Supported: JPG, JPEG, PNG, WEBP, MP4');
      } else {
        setUploadError('File upload failed');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        setUploadError('Failed to read file');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
    },
    maxFiles: 1,
    maxSize: 200 * 1024 * 1024, // 200MB
  });

  const clearPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadError(null);
    setIsUploading(false);
    onFileSelect?.(null);
    onImageUpload('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (preview) {
    return (
      <div className="upload-preview">
        <button className="clear-preview" onClick={clearPreview}>
          <X size={16} />
        </button>
        {selectedFile && (
          <div className="file-info">
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
          </div>
        )}
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
        <span className="format-tag">WEBP</span>
        <span className="format-tag">MP4</span>
        <span className="format-tag">Max 200MB</span>
      </div>
      {uploadError && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
