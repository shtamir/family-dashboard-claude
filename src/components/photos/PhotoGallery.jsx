// src/components/photos/PhotoGallery.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PhotoGallery = ({ photos, currentIndex, setCurrentIndex, slideshow }) => {
  const { t } = useTranslation();
  const [fullscreen, setFullscreen] = useState(false);
  
  // Exit fullscreen when pressing Escape
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setFullscreen(false);
    } else if (e.key === 'ArrowRight') {
      // Next photo
      setCurrentIndex((currentIndex + 1) % photos.length);
    } else if (e.key === 'ArrowLeft') {
      // Previous photo
      setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
    }
  };

  // Navigate to previous photo
  const prevPhoto = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

  // Navigate to next photo
  const nextPhoto = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };
  
  // Current photo
  const currentPhoto = photos[currentIndex];
  
  // Format date if available
  const formatDate = (date) => {
    if (!date) return '';
    
    return date.toLocaleDateString(undefined, {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  // In fullscreen mode, show only the current photo
  if (fullscreen) {
    return (
      <div 
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        <button 
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
          onClick={() => setFullscreen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
          onClick={prevPhoto}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700"
          onClick={nextPhoto}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="w-full h-full flex items-center justify-center p-8">
          <img 
            src={currentPhoto.displayUrl} 
            alt={currentPhoto.description || currentPhoto.filename}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {(currentPhoto.description || currentPhoto.creationTime) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            {currentPhoto.description && (
              <p className="text-lg">{currentPhoto.description}</p>
            )}
            {currentPhoto.creationTime && (
              <p className="text-sm text-gray-300">{formatDate(currentPhoto.creationTime)}</p>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // In slideshow mode, show only the current photo
  if (slideshow) {
    return (
      <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden">
        <img 
          src={currentPhoto.displayUrl} 
          alt={currentPhoto.description || currentPhoto.filename}
          className="w-full h-full object-cover"
          onClick={() => setFullscreen(true)}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          {currentPhoto.description && (
            <p className="text-sm md:text-base truncate">{currentPhoto.description}</p>
          )}
          <div className="flex justify-between items-center">
            {currentPhoto.creationTime && (
              <p className="text-xs text-gray-300">{formatDate(currentPhoto.creationTime)}</p>
            )}
            <p className="text-xs">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <button 
            className="ml-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 pointer-events-auto"
            onClick={prevPhoto}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="mr-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 pointer-events-auto"
            onClick={nextPhoto}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  
  // Normal grid view
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[calc(100vh-300px)] overflow-y-auto p-1">
      {photos.map((photo, index) => (
        <div 
          key={photo.id}
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
            index === currentIndex ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => {
            setCurrentIndex(index);
            setFullscreen(true);
          }}
        >
          <img 
            src={photo.thumbnailUrl} 
            alt={photo.description || photo.filename}
            className="w-full h-32 object-cover"
            loading="lazy"
          />
          {photo.description && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1">
              <p className="text-xs truncate">{photo.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotoGallery;