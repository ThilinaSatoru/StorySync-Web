"use client"
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoPlayer from '../VideoPlayer';
import videos, { VideoData } from '../data';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, SkipForward, SkipBack } from 'lucide-react';
import VideoDetailsPage from '../../../components/Detail';

export default function VideoPage({ params, }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const videoId = { id: resolvedParams.id }

    return (
        <div>
            <button
                onClick={() => router.back()}
                className="p-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={20} />
                Back to Gallery
            </button>
            {/* <VideoDetailsPage params={videoId} /> */}
            <VideoPlayer params={videoId} />
        </div>
    );
};
