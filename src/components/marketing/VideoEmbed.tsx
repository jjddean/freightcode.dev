import React from 'react';

interface VideoEmbedProps {
    videoId: string;
    title: string;
    className?: string;
}

/**
 * Responsive YouTube video embed component.
 * Click-to-play only, no autoplay with sound.
 */
export const VideoEmbed: React.FC<VideoEmbedProps> = ({
    videoId,
    title,
    className = ''
}) => {
    return (
        <div className={`relative w-full aspect-video ${className}`}>
            <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full rounded-lg border border-slate-800"
            />
        </div>
    );
};

interface VideoThumbnailProps {
    thumbnailUrl: string;
    title: string;
    onClick: () => void;
    className?: string;
}

/**
 * Video thumbnail with play button overlay.
 * For lazy-loading video content.
 */
export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
    thumbnailUrl,
    title,
    onClick,
    className = ''
}) => {
    return (
        <button
            onClick={onClick}
            className={`relative w-full aspect-video group cursor-pointer ${className}`}
            aria-label={`Play ${title}`}
        >
            <img
                src={thumbnailUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
                loading="lazy"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors rounded-lg">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                        className="w-6 h-6 text-slate-900 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>
        </button>
    );
};

export default VideoEmbed;
