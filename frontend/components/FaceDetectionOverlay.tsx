'use client';

import { useState, useEffect, useRef } from 'react';

interface FaceDetectionOverlayProps {
  imageUrl: string | null;
  faceBoxes: number[][] | null;
}

export default function FaceDetectionOverlay({ imageUrl, faceBoxes }: FaceDetectionOverlayProps) {
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number } | null>(null);
  const [displayedImageDimensions, setDisplayedImageDimensions] = useState<{ width: number; height: number; offsetX: number; offsetY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageUrl && imageRef.current) {
      const img = imageRef.current;
      
      const handleLoad = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
      }
    }
  }, [imageUrl]);

  useEffect(() => {
    if (containerRef.current) {
      const updateContainerDimensions = () => {
        setContainerDimensions({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0,
        });
      };

      updateContainerDimensions();
      window.addEventListener('resize', updateContainerDimensions);
      return () => window.removeEventListener('resize', updateContainerDimensions);
    }
  }, [imageUrl]);

  useEffect(() => {
    if (imageRef.current && imageDimensions && containerDimensions) {
      const img = imageRef.current;
      
      // Calculate the actual displayed image dimensions with objectFit: contain
      const containerAspect = containerDimensions.width / containerDimensions.height;
      const imageAspect = imageDimensions.width / imageDimensions.height;
      
      let displayedWidth, displayedHeight, offsetX, offsetY;
      
      if (imageAspect > containerAspect) {
        // Image is wider than container - scale by width
        displayedWidth = containerDimensions.width;
        displayedHeight = containerDimensions.width / imageAspect;
        offsetX = 0;
        offsetY = (containerDimensions.height - displayedHeight) / 2;
      } else {
        // Image is taller than container - scale by height
        displayedHeight = containerDimensions.height;
        displayedWidth = containerDimensions.height * imageAspect;
        offsetX = (containerDimensions.width - displayedWidth) / 2;
        offsetY = 0;
      }
      
      setDisplayedImageDimensions({
        width: displayedWidth,
        height: displayedHeight,
        offsetX,
        offsetY,
      });
    }
  }, [imageDimensions, containerDimensions, imageUrl]);

  const calculateBoxPosition = (box: number[]) => {
    if (!imageDimensions || !displayedImageDimensions) return null;

    const [x, y, width, height] = box;
    const scaleX = displayedImageDimensions.width / imageDimensions.width;
    const scaleY = displayedImageDimensions.height / imageDimensions.height;

    return {
      left: `${displayedImageDimensions.offsetX + x * scaleX}px`,
      top: `${displayedImageDimensions.offsetY + y * scaleY}px`,
      width: `${width * scaleX}px`,
      height: `${height * scaleY}px`,
    };
  };

  if (!imageUrl) {
    return null;
  }

  const hasFaces = faceBoxes && faceBoxes.length > 0;

  return (
    <div className="w-full">
      {/* Face Statistics Card */}
      {hasFaces && (
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid #8B5CF6',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Faces Detected</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#fff' }}>{faceBoxes.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Detection Status</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#14C8A8' }}>Active</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Image Type</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>{faceBoxes.length > 1 ? 'Group Photo' : 'Single Person'}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Analysis</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#14C8A8' }}>Complete</div>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        className="relative w-full rounded-lg overflow-hidden border border-gray-700"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Uploaded image with face detection"
          className="w-full h-auto block"
          style={{ maxHeight: '500px', objectFit: 'contain' }}
        />

        {hasFaces && imageDimensions && displayedImageDimensions && (
          <>
            {faceBoxes.map((box, index) => {
              const position = calculateBoxPosition(box);
              if (!position) return null;

              return (
                <div
                  key={index}
                  className="absolute pointer-events-none"
                  style={{
                    left: position.left,
                    top: position.top,
                    width: position.width,
                    height: position.height,
                    border: '2px solid #8B5CF6',
                    background: 'rgba(139,92,246,0.08)',
                  }}
                >
                  <div
                    className="absolute -top-6 left-0 text-white text-xs px-2 py-1 rounded font-semibold"
                    style={{ 
                      whiteSpace: 'nowrap',
                      background: '#8B5CF6'
                    }}
                  >
                    Person {index + 1}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {!hasFaces && (
        <div className="mt-3 text-center text-gray-400 text-sm">
          No faces detected in image
        </div>
      )}
    </div>
  );
}
