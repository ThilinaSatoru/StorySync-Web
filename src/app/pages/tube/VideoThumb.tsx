"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Eye, ExternalLink, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Video } from '@/services/dto';

interface VideoThumbnailProps {
    video: Video;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ video }) => {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [playbackError, setPlaybackError] = useState(false);

    useEffect(() => {
        // Construct thumbnail and preview URLs
        if (video.thumbnailPath) {
            setThumbnailUrl(`http://localhost:8080/api/video/thumbnail?fileName=${encodeURIComponent(video.thumbnailPath)}`);
        }
        if (video.previewPath) {
            setPreviewUrl(`http://localhost:8080/api/video/preview?fileName=${encodeURIComponent(video.previewPath)}`);
        }
    }, [video.thumbnailPath, video.previewPath]);

    const startVideoPreview = useCallback(() => {
        if (videoRef.current && previewUrl) {
            // Abort any previous play attempts
            videoRef.current.pause();

            // Reset video state
            videoRef.current.currentTime = 0;

            // Attempt to play with robust error handling
            videoRef.current.play()
                .then(() => {
                    setIsHovering(true);
                    setPlaybackError(false);
                })
                .catch((error) => {
                    console.warn('Video preview error:', error);
                    setIsHovering(false);
                    setPlaybackError(true);
                });
        }
    }, [previewUrl]);

    const handleMouseEnter = useCallback(() => {
        // Clear any existing hover timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Set a new timeout to start video preview
        hoverTimeoutRef.current = setTimeout(startVideoPreview, 100);
    }, [startVideoPreview]);

    const handleMouseLeave = useCallback(() => {
        // Clear hover timeout if it exists
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        // Stop video and reset state
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        setIsHovering(false);
    }, []);

    const handleClick = () => {
        if (playbackError && previewUrl) {
            // window.open(previewUrl, '_blank', 'noopener,noreferrer');
        } else {
            router.push(`/pages/tube/${encodeURIComponent(video.id)}`);
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    return (
        <Card
            className="relative overflow-hidden transition-transform duration-200 group hover:scale-105 hover:shadow-lg"
            onClick={handleClick}
        >
            <div
                className="relative cursor-pointer aspect-video"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Thumbnail Image */}
                <img
                    src={thumbnailUrl || '/thumbnails/loading-640x640.jpg'}
                    alt={video.fileName || 'Video thumbnail'}
                    className="object-cover w-full h-full"
                    onError={() => setThumbnailUrl('/thumbnails/loading-640x640.jpg')}
                />

                {/* Preview Video */}
                {previewUrl && (
                    <video
                        ref={videoRef}
                        src={previewUrl}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                {/* Duration Overlay */}
                {video.duration && (
                    <div className="absolute px-2 py-1 text-sm text-white bg-black bg-opacity-75 rounded bottom-2 right-2">
                        {video.duration}
                    </div>
                )}

                {/* Playback Error Fallback */}
                {playbackError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(previewUrl || '', '_blank', 'noopener,noreferrer');
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-black transition-colors bg-white rounded-lg hover:bg-gray-100"
                        >
                            <Play className="w-4 h-4" />
                            <span>Play in System Player</span>
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Information */}
            <CardContent className="p-4">
                <h3 className="mb-2 text-lg font-semibold line-clamp-2">
                    {video.fileName || 'Untitled Video'}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                    <p className="font-medium">{video.format}</p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{video.sizeBytes.toLocaleString()} views</span>
                        </div>
                        {video.modifiedTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{video.modifiedTime}</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default VideoThumbnail;