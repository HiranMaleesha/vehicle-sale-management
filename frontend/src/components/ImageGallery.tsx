import React, { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  if (!images || !Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">🚗</div>
          <div className="text-xl">No Images Available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <img
        src={images[currentImageIndex]}
        alt={alt}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            ‹
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default ImageGallery;