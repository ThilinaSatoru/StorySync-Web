export interface VideoData {
    id: string;
    title: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    views: number;
    uploadedAt: string;
    creator: string;
}

const videos: VideoData[] = [
    {
        id: "1",
        title: "First Video",
        videoUrl: '/videos/f1.mp4',
        thumbnailUrl: '/thumbnails/t1.png',
        duration: "0:30",
        views: 10,
        uploadedAt: "1 day ago",
        creator: "sato"
    },
    {
        id: "2",
        title: "Second Video",
        videoUrl: '/videos/f2.mp4',
        thumbnailUrl: '/thumbnails/t2.png',
        duration: "1:15",
        views: 10,
        uploadedAt: "2 days ago",
        creator: "sato"
    },
    {
        id: "3",
        title: "BBC Teen white girl",
        videoUrl: '/videos/bbc.m3u8',
        thumbnailUrl: '/thumbnails/t2.png',
        duration: "1:15",
        views: 10,
        uploadedAt: "2 days ago",
        creator: "sato"
    }
    // Add more videos as needed
];

export default videos;