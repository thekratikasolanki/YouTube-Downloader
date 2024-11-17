// src/YouTubeDownloader.jsx
import React, { useState } from 'react';
import axios from 'axios';

const YouTubeDownloader = () => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [outputFolder, setOutputFolder] = useState('');

    const searchVideos = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/search', {
                keyword: keyword,
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error searching videos:', error);
        }
    };

    const downloadVideos = async (videoUrls) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/download', {
                videoUrls: videoUrls,
                outputFolder: outputFolder,
            });
            alert(response.data.message || response.data.error);
        } catch (error) {
            console.error('Error downloading videos:', error);
        }
    };

    return (
        <div>
            <h1>YouTube Video Downloader</h1>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword"
            />
            <button onClick={searchVideos}>Search Videos</button>
            <input
                type="text"
                value={outputFolder}
                onChange={(e) => setOutputFolder(e.target.value)}
                placeholder="Output Folder Path"
            />
            <ul>
                {results.map((result) => (
                    <li key={result.url}>
                        {result.title} <button onClick={() => downloadVideos([result.url])}>Download</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default YouTubeDownloader;
