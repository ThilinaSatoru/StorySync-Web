"use client"

import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullScreen = () => {
        if (videoRef.current) {
            if (!isFullScreen) {
                if (videoRef.current.requestFullscreen) {
                    videoRef.current.requestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            setIsFullScreen(!isFullScreen);
        }
    };

    return (
        <div className="relative w-full bg-black aspect-video group">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Custom Controls */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-4">
                    <button
                        onClick={togglePlay}
                        className="text-white hover:bg-white/20 p-2 rounded-full"
                    >
                        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                    </button>
                    <button
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20 p-2 rounded-full"
                    >
                        {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
                    </button>
                    <button
                        onClick={toggleFullScreen}
                        className="text-white hover:bg-white/20 p-2 rounded-full"
                    >
                        {isFullScreen ? <Minimize size={32} /> : <Maximize size={32} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;