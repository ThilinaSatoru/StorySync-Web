const getStreamUrl = (filePath: string) => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return `http://localhost:8080/api/video/stream?fileName=${`file:///${normalizedPath}`}`;
};