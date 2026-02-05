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
  backgroundComponent?: React.ReactNode;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const MediaCardHeader: React.FC<MediaCardHeaderProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundVideo,
  overlayOpacity = 0.5,
  className,
  children,
  backgroundComponent,
  isExpandable = false,
  isExpanded: controlledIsExpanded,
  onToggle
}) => {
  const [internalIsExpanded, setInternalIsExpanded] = React.useState(false);
  const isExpanded = controlledIsExpanded !== undefined ? controlledIsExpanded : internalIsExpanded;

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsExpanded(!internalIsExpanded);
    }
  };

  return (
    <div className={cn(
      "relative w-full overflow-hidden rounded-lg transition-all duration-500 ease-in-out",
      isExpanded ? "h-[500px]" : "h-24 md:h-28 lg:h-32",
      className
    )}>
      {/* Background Media */}
      {React.isValidElement(backgroundComponent) ? (
        React.cloneElement(backgroundComponent as React.ReactElement<any>, {
          className: cn(
            "absolute inset-0 w-full h-full",
            !isExpanded && "pointer-events-none", // Disable interaction when collapsed
            (backgroundComponent.props as any).className // Preserve existing classes
          )
        })
      ) : backgroundVideo ? (
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
        className="absolute inset-0 bg-black transition-opacity duration-300 pointer-events-none"
        style={{ opacity: isExpanded ? Math.max(0, overlayOpacity - 0.2) : overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className={cn("max-w-4xl transition-all duration-300", isExpanded && "opacity-0 invisible")}>
          {/* Hide text when expanded to give clear view of map, or keep it? 
               User said "expand to use", implied map usage. Text might abstract map. 
               Let's fade it out or keep it minimal. I'll keep it for now but maybe move it.
               Actually, let's keep it visible but allow clicks through.
           */}
          <div className="pointer-events-auto"> {/* Allow text interaction if needed */}
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

      {/* Expand Toggle Button */}
      {isExpandable && (
        <button
          onClick={handleToggle}
          className="absolute bottom-3 right-3 z-50 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition-colors border border-white/20"
          title={isExpanded ? "Collapse Map" : "Expand Map"}
        >
          {isExpanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-14 14" /><path d="M3 21l14-14" /></svg>
          )}
        </button>
      )}
    </div>
  );
};

export default MediaCardHeader;
