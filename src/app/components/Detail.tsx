"use client"

import React, { useState, useEffect } from 'react';
import { Clock, Eye, FileVideo, FileText, Disc } from 'lucide-react';
import VideoPlayer from './Player'; // You'll need to create this
import axios from 'axios'; // Create this service
import { getVideoById } from '@/services/videoService';
import { Video } from '@/services/dto';


export default function VideoDetailsPage({ params }: { params: { id: string } }) {
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadVideoDetails() {
            try {
                setLoading(true);
                const videoDetails = await getVideoById(params.id);
                setVideo(videoDetails);
            } catch (err) {
                console.error('Failed to fetch video details:', err);
                setError('Failed to load video details');
            } finally {
                setLoading(false);
            }
        }

        loadVideoDetails();
    }, [params.id]);

    if (loading) return <div>Loading video details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!video) return <div>Video not found</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Video Player */}
                <div>
                    <VideoPlayer
                        src={`http://localhost:8080/api/video/stream?fileName=${encodeURIComponent(video.filePath)}`}
                        poster={video.thumbnailPath ? `http://localhost:8080/api/video/thumbnail?fileName=${encodeURIComponent(video.thumbnailPath)}` : undefined}
                    />
                </div>

                {/* Video Details */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-bold">{video.fileName}</h1>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <FileVideo className="w-5 h-5 text-gray-600" />
                            <span>Format: {video.format}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-600" />
                            <span>Duration: {video.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-gray-600" />
                            <span>Size: {(video.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Disc className="w-5 h-5 text-gray-600" />
                            <span>Modified: {video.modifiedTime}</span>
                        </div>
                    </div>

                    {/* {video.metadata && (
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">Video Metadata</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {video.metadata.width && (
                                    <p>Width: {video.metadata.width}px</p>
                                )}
                                {video.metadata.height && (
                                    <p>Height: {video.metadata.height}px</p>
                                )}
                                {video.metadata.bitrate && (
                                    <p>Bitrate: {video.metadata.bitrate} kbps</p>
                                )}
                                {video.metadata.codec && (
                                    <p>Codec: {video.metadata.codec}</p>
                                )}
                            </div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}