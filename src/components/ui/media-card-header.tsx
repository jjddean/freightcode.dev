import React from 'react';
import { cn } from '@/lib/utils';

interface MediaCardHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  className?: string;
  children?: React.ReactNode;
}

const MediaCardHeader: React.FC<MediaCardHeaderProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.5,
  className,
  children
}) => {
  return (
    <div className={cn(
      "relative w-full h-24 md:h-28 lg:h-32 overflow-hidden rounded-lg",
      className
    )}>
      {/* Background Media */}
      {backgroundVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
          {/* Fallback to image if video fails */}
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </video>
      ) : backgroundImage ? (
        <img
          src={backgroundImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-primary-600" />
      )}

      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {subtitle && (
            <p className="text-xs font-medium text-gray-200 uppercase tracking-wide mb-1">
              {subtitle}
            </p>
          )}
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-100 max-w-2xl">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCardHeader;
