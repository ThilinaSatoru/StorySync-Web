// VideoGallery.tsx
'use client';
import React, { useEffect, useState, useCallback } from "react";
import VideoThumbnail from './VideoThumb';
import { Video } from "@/services/dto";
import { getVideo } from "@/services/videoService";
import { PaginatedContent } from "@/app/components/PaginatedComp";


const VideoGallery: React.FC = () => {
    const [videos, setFiles] = useState<Video[]>([]);

    const fetchFiles = useCallback(async () => {
        try {

            const data = await getVideo();

            if (data && data.length > 0) {
                setFiles(data);
            }
        } catch (error) {
            console.error("Error fetching admin:", error);
        }
    }, []);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return (
        <main className="">
            {/* className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" */}
            <PaginatedContent<Video>
                items={videos}
                itemsPerPage={5}
                variant="grid"
                renderItem={(video) => (
                    <>
                        <VideoThumbnail
                            key={video.id}  // Added key prop
                            video={video}
                        />
                    </>
                )}
            />
            {/* {videos.map((video) => (
                <VideoThumbnail
                    key={video.id}  // Added key prop
                    video={video}
                />
            ))} */}
        </main>
    );
};

export default VideoGallery;