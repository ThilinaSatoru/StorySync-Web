"use client"
import React, { useEffect, useRef, useState } from 'react';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    ThumbsUp,
    ThumbsDown,
    Share2,
    Plus,
    MoreHorizontal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getVideoById } from '@/services/videoService';
import { Video } from '@/services/dto';
import LoadingPage from '@/app/components/LoadingPage';

export default function VideoPlayer({ params }: { params: { id: string } }) {
    const { id } = params;

    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const [video, setVideo] = useState<Video | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isHovering, setIsHovering] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);


    // Comprehensive toggle functions using current state and videoRef
    const togglePlay = React.useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play().catch(error => console.error("Play failed:", error));
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);

    const toggleMute = React.useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    }, []);

    const toggleFullscreen = React.useCallback(() => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    }, []);


    // Video loading effect (moved up to ensure it runs early)
    useEffect(() => {
        async function loadVideoDetails() {
            try {
                setLoading(true);
                const videoDetails = await getVideoById(id);
                setVideo(videoDetails);
                setVideoUrl(`http://localhost:8080/api/video/stream?fileName=${encodeURIComponent(videoDetails.filePath)}`)
            } catch (err) {
                console.error('Failed to fetch video details:', err);
                setError('Failed to load video details');
            } finally {
                setLoading(false);
            }
        }

        loadVideoDetails();
    }, [id]);  // Dependency array remains the same

    // Keyboard shortcuts with arrow keys
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key.toLowerCase()) {
                case ' ':  // Space
                case 'k':  // Play/Pause
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'm':  // Mute toggle
                    toggleMute();
                    break;
                case 'enter':  // Fullscreen
                    toggleFullscreen();
                    break;
                case 'arrowup':  // Volume Up
                    e.preventDefault();
                    const newVolumeUp = Math.min(1, volume + 0.1);
                    videoRef.current.volume = newVolumeUp;
                    setVolume(newVolumeUp);
                    break;
                case 'arrowdown':  // Volume Down
                    e.preventDefault();
                    const newVolumeDown = Math.max(0, volume - 0.1);
                    videoRef.current.volume = newVolumeDown;
                    setVolume(newVolumeDown);
                    break;
                case 'arrowright':  // Forward 10s
                    videoRef.current.currentTime += 4;
                    break;
                case 'arrowleft':  // Back 10s
                    videoRef.current.currentTime -= 4;
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [togglePlay, toggleMute, toggleFullscreen, volume]);


    // Other event handlers remain the same...
    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    // Existing helper functions remain the same
    const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatViews = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M views`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K views`;
        }
        return `${count} views`;
    };


    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressBarRef.current && videoRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = pos * duration;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };


    // Early return for loading states
    if (loading) return <div>Loading video details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>Video not found</div>;
    return (
        <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            {videoUrl ? <>
                <div className="flex flex-col items-center">
                    {/* Video Container */}
                    <div className="w-full max-w-[1280px] mx-auto rounded-lg overflow-hidden shadow-lg">
                        <div className="relative bg-black aspect-video max-h-[calc(100vh-100px)] flex items-center justify-center">
                            <video
                                ref={videoRef}
                                className="max-w-full max-h-full object-contain"
                                onClick={togglePlay}
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                <source src={videoUrl} type="video/mp4" />
                            </video>

                            {/* Centered Play/Pause Button */}
                            {isHovering && (
                                <button
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                    bg-black/50 rounded-full p-4 text-white hover:bg-black/70 transition-all duration-300"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Controls Below Video */}


                    {/* Controls and Additional Content */}
                    <div className="w-full max-w-[1280px] mt-4">
                        {/* Existing controls and content remain the same */}
                        {/* Progress bar, control bar, video info, etc. */}
                        <div className="bg-white px-4 py-2">
                            {/* Progress Bar */}
                            <div
                                ref={progressBarRef}
                                className="h-1 w-full bg-gray-200 cursor-pointer group relative"
                                onClick={handleProgressBarClick}
                            >
                                <div
                                    className="absolute h-full bg-red-600"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                />
                                <div
                                    className="absolute h-3 w-3 bg-red-600 rounded-full -mt-1 opacity-0 group-hover:opacity-100"
                                    style={{ left: `${(currentTime / duration) * 100}%`, transform: 'translateX(-50%)' }}
                                />
                            </div>

                            {/* Control Bar */}
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-4">
                                    <button onClick={togglePlay} className="hover:text-red-600">
                                        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                    </button>

                                    <div className="flex items-center gap-2 relative"
                                        onMouseEnter={() => setShowVolumeSlider(true)}
                                        onMouseLeave={() => setShowVolumeSlider(false)}>
                                        <button onClick={toggleMute}>
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>

                                        <div className={`absolute bottom-full mb-2 bg-white p-2 rounded-lg shadow-lg transition-opacity
                              ${showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={volume}
                                                onChange={handleVolumeChange}
                                                className="w-24 accent-red-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button>
                                        <Settings size={20} />
                                    </button>
                                    <button onClick={toggleFullscreen}>
                                        <Maximize size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Video Info */}
                        <div className="px-4 py-3 border-b">
                            <h1 className="text-xl font-bold mb-2">{video.fileName}</h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{video.resolution}</h3>
                                        <div className="text-sm text-gray-600">
                                            {formatViews(video.duration)} • {video.createdTime}
                                        </div>
                                    </div>
                                    <button className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                                        Subscribe
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center bg-gray-100 rounded-full">
                                        <button
                                            className={`flex items-center gap-1 px-4 py-2 rounded-l-full hover:bg-gray-200
                           ${isLiked ? 'text-blue-600' : ''}`}
                                            onClick={() => setIsLiked(!isLiked)}
                                        >
                                            <ThumbsUp size={18} />
                                            <span>{video.duration}</span>
                                        </button>
                                        <div className="w-px h-6 bg-gray-300"></div>
                                        <button
                                            className={`px-4 py-2 rounded-r-full hover:bg-gray-200
                           ${isDisliked ? 'text-blue-600' : ''}`}
                                            onClick={() => setIsDisliked(!isDisliked)}
                                        >
                                            <ThumbsDown size={18} />
                                        </button>
                                    </div>

                                    <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                                        <Share2 size={18} />
                                        Share
                                    </button>

                                    <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100">
                                        <Plus size={18} />
                                        Save
                                    </button>

                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Keyboard Shortcuts Card */}
                        <Card className="mt-4 mx-4">
                            <CardContent className="p-4">
                                <h2 className="text-lg font-semibold mb-3">Keyboard shortcuts</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="mb-2">
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Space</kbd> or{' '}
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">k</kbd> Play/Pause
                                        </p>
                                        <p className="mb-2">
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">m</kbd> Mute
                                        </p>
                                        <p className="mb-2">
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">f</kbd> Fullscreen
                                        </p>
                                    </div>
                                    <div>
                                        <p className="mb-2">
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">j</kbd> Back 10 seconds
                                        </p>
                                        <p className="mb-2">
                                            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">l</kbd> Forward 10 seconds
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </> : <>
                <LoadingPage />
            </>}
        </div>
    );
};