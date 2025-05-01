// src/components/photos/PhotosWidget.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import usePhotosService from '../../services/photos';
import PhotoGallery from './PhotoGallery';
import AlbumSelector from './AlbumSelector';

const PhotosWidget = () => {
  const { t } = useTranslation();
  const photosService = usePhotosService();
  const [photos, setPhotos] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [albumId, setAlbumId] = useState('');
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [slideshow, setSlideshow] = useState(false);
  const slideshowIntervalRef = useRef(null);

  // Fetch photos data
  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentAlbumId = albumId || photosService.getAlbumId();
      
      if (!currentAlbumId) {
        // No album selected yet
        setPhotos([]);
        setAlbumId('');
        setLoading(false);
        return;
      }
      
      const data = await photosService.getPhotosFromAlbum(currentAlbumId);
      setPhotos(data);
      setAlbumId(currentAlbumId);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError(t('photos.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch albums for selection
  const fetchAlbums = async () => {
    try {
      const data = await photosService.getAlbums();
      setAlbums(data);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  // Handle album selection
  const handleAlbumSelect = (id) => {
    setAlbumId(id);
    photosService.updateAlbumId(id);
    setShowAlbumSelector(false);
    fetchPhotos();
  };

  // Toggle slideshow mode
  const toggleSlideshow = () => {
    const newSlideshowState = !slideshow;
    setSlideshow(newSlideshowState);
    
    // Clear existing interval if any
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current);
      slideshowIntervalRef.current = null;
    }
    
    // Set up slideshow interval
    if (newSlideshowState && photos.length > 1) {
      slideshowIntervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % photos.length);
      }, 5000); // Change photo every 5 seconds
    }
  };

  // Current photo index for slideshow
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initial data fetch
  useEffect(() => {
    fetchPhotos();
    
    // Set up event listener for refresh
    const handleRefresh = () => fetchPhotos();
    window.addEventListener('refreshWidgets', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWidgets', handleRefresh);
      
      // Clean up slideshow interval
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, []);

  // Loading state
  if (loading && photos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {t('photos.title')}
        </h2>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchPhotos}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 rounded-lg"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // No album selected state
  if (!albumId) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('photos.title')}
        </h2>
        <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('photos.noAlbumSelected')}
          </p>
          <button
            onClick={() => {
              fetchAlbums();
              setShowAlbumSelector(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('photos.selectAlbum')}
          </button>
        </div>
        
        {showAlbumSelector && (
          <AlbumSelector 
            albums={albums} 
            loading={loading} 
            onSelect={handleAlbumSelect}
            onClose={() => setShowAlbumSelector(false)}
          />
        )}
      </div>
    );
  }

  // No photos state
  if (photos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('photos.title')}
        </h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>{t('photos.noPhotos')}</p>
          <button
            onClick={() => {
              fetchAlbums();
              setShowAlbumSelector(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('photos.changeAlbum')}
          </button>
        </div>
        
        {showAlbumSelector && (
          <AlbumSelector 
            albums={albums} 
            loading={loading} 
            onSelect={handleAlbumSelect}
            onClose={() => setShowAlbumSelector(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('photos.title')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleSlideshow}
            className={`px-3 py-1 rounded-lg text-sm ${
              slideshow 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
          >
            {t('photos.slideshow')}
          </button>
          <button
            onClick={() => {
              fetchAlbums();
              setShowAlbumSelector(true);
            }}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-white"
          >
            {t('photos.changeAlbum')}
          </button>
        </div>
      </div>
      
      {/* Photo Gallery */}
      <PhotoGallery 
        photos={photos} 
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        slideshow={slideshow}
      />
      
      {/* Album Selector Modal */}
      {showAlbumSelector && (
        <AlbumSelector 
          albums={albums} 
          loading={loading} 
          onSelect={handleAlbumSelect}
          onClose={() => setShowAlbumSelector(false)}
        />
      )}
      
      {/* Refresh indicator */}
      {loading && photos.length > 0 && (
        <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t('common.refreshing')}
        </div>
      )}
    </div>
  );
};

export default PhotosWidget;