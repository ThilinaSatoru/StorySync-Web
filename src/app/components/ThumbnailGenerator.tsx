"use client"
import React, { useCallback } from 'react';

interface ThumbnailGeneratorProps {
    videoUrl: string;
    onThumbnailGenerated: (thumbnailUrl: string) => void;
}

export const generateThumbnail = async (videoUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Create video element
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = videoUrl;

        // Create canvas for thumbnail
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Handle video metadata load
        video.addEventListener('loadedmetadata', () => {
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Seek to 25% of the video duration for thumbnail
            video.currentTime = video.duration * 0.25;
        });

        // Handle seeking completion
        video.addEventListener('seeked', () => {
            if (context) {
                // Draw current video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert canvas to data URL
                const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);

                // Clean up
                video.remove();
                resolve(thumbnailUrl);
            } else {
                reject(new Error('Failed to get canvas context'));
            }
        });

        // Handle errors
        video.addEventListener('error', (error) => {
            reject(new Error(`Video loading failed: ${error}`));
        });

        // Start loading the video
        video.load();
    });
};

const ThumbnailGenerator: React.FC<ThumbnailGeneratorProps> = ({
    videoUrl,
    onThumbnailGenerated
}) => {
    const handleThumbnailGeneration = useCallback(async () => {
        try {
            const thumbnailUrl = await generateThumbnail(videoUrl);
            onThumbnailGenerated(thumbnailUrl);
        } catch (error) {
            console.error('Thumbnail generation failed:', error);
        }
    }, [videoUrl, onThumbnailGenerated]);

    return (
        <button
            onClick={handleThumbnailGeneration}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
            Generate Thumbnail
        </button>
    );
};

export default ThumbnailGenerator;