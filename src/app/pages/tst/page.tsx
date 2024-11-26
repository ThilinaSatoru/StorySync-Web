"use client"
import React, { useEffect, useRef, useState } from 'react';
import { PaginatedContent } from "@/app/components/PaginatedComp";




interface VideoItem {
    title: string;
    thumbnail: string;
    duration: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
}


export default function VideoGalleryExample() {
    const videoItems: VideoItem[] = [
        { title: "Next.js Tutorial", thumbnail: "/api/placeholder/300/200", duration: "12:45" },
        { title: "React Hooks Deep Dive", thumbnail: "/api/placeholder/300/200", duration: "24:30" },
        // More video items...
    ];

    return (
        <PaginatedContent<VideoItem>
            items={videoItems}
            itemsPerPage={3}
            variant="grid"
            renderItem={(video) => (
                <div className="text-center">
                    <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-48 object-cover rounded"
                    />
                    <h3 className="mt-2 font-semibold">{video.title}</h3>
                    <p className="text-sm text-gray-500">{video.duration}</p>
                </div>
            )}
        />
    );
}