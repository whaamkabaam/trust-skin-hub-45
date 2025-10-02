
import React, { useState } from 'react';
import { PROVIDER_CONFIGS } from '@/types/filters';

interface ProviderLogoProps {
  providerId: keyof typeof PROVIDER_CONFIGS;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  showFallback?: boolean;
  enhanced?: boolean;
}

const ProviderLogo: React.FC<ProviderLogoProps> = ({ 
  providerId, 
  size = 'md', 
  className = '', 
  showFallback = true,
  enhanced = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const config = PROVIDER_CONFIGS[providerId];
  
  if (!config) {
    console.warn(`Provider config not found for: ${providerId}`);
    return null;
  }

  // Enhanced size configurations with improved mobile-friendly sizes
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    xxl: 'w-20 h-20'
  };

  // Container classes based on aspect ratio
  const containerClasses = {
    square: 'aspect-square',
    wide: 'aspect-[3/2]',
    tall: 'aspect-[2/3]'
  };

  // Enhanced background classes with better contrast for all logo types
  const backgroundClasses = {
    white: enhanced ? 'bg-white shadow-md border border-gray-200' : 'bg-white',
    transparent: enhanced ? 
      'bg-gray-50/90 backdrop-blur-sm shadow-md border border-gray-200/70' : 
      'bg-gray-50/60 border border-gray-200/40',
    dark: enhanced ? 
      'bg-gray-900 shadow-md border border-gray-700' : 
      'bg-gray-800 border border-gray-600'
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load logo for ${config.displayName}:`, {
      src: config.logo,
      providerId,
      error: e.currentTarget.src,
      naturalWidth: e.currentTarget.naturalWidth,
      naturalHeight: e.currentTarget.naturalHeight
    });
    setImageError(true);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Successfully loaded logo for ${config.displayName}:`, {
      src: config.logo,
      providerId,
      naturalWidth: e.currentTarget.naturalWidth,
      naturalHeight: e.currentTarget.naturalHeight
    });
    setImageLoaded(true);
  };

  const shouldShowFallback = imageError || (!imageLoaded && showFallback);

  return (
    <div 
      className={`
        relative inline-flex items-center justify-center rounded-xl overflow-hidden
        ${sizeClasses[size]} 
        ${containerClasses[config.logoAspectRatio]} 
        ${backgroundClasses[config.logoBackground]}
        ${enhanced ? 'ring-1 ring-black/10' : ''}
        ${className}
      `}
    >
      {!imageError && (
        <img
          src={config.logo}
          alt={`${config.displayName} logo`}
          className={`
            w-full h-full object-contain transition-opacity duration-200
            ${enhanced ? 'p-1.5' : 'p-1'}
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${config.logoBackground === 'dark' ? 'filter brightness-0 invert' : ''}
          `}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      )}
      
      {shouldShowFallback && (
        <div 
          className={`
            ${imageError ? 'flex' : imageLoaded ? 'hidden' : 'flex'}
            absolute inset-0 items-center justify-center font-bold
            ${config.logoBackground === 'dark' ? 'text-white' : config.textColor} 
            transition-opacity duration-200
          `}
          style={{ 
            fontSize: size === 'xs' ? '6px' : 
                    size === 'sm' ? '8px' : 
                    size === 'md' ? '12px' :
                    size === 'lg' ? '16px' :
                    size === 'xl' ? '20px' : '24px'
          }}
        >
          {imageError ? config.displayName.substring(0, 2).toUpperCase() : config.displayName.charAt(0)}
        </div>
      )}
    </div>
  );
};

export default ProviderLogo;
