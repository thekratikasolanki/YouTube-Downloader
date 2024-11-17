import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import logo from './assets/removeytlogo.png'; // Adjust the path as necessary

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10; // Set how many results to show per page
  const [downloadProgress, setDownloadProgress] = useState({}); // State to track progress
  const [message, setMessage] = useState(''); // State for messages

  const handleSearch = async () => {
    if (!keyword) {
      setMessage('Please enter a search keyword!');
      return;
    }

    setLoading(true);
    setMessage('Please wait...'); // Show loading message
    try {
      const response = await axios.get(`http://localhost:5000/search?keyword=${keyword}`);
      setSearchResults(response.data.results);
      setVideoUrls([]); // Reset video URLs on new search
      setCurrentPage(1); // Reset to the first page on new search
      setDownloadProgress({}); // Reset progress when searching
      setMessage('Search completed successfully!'); // Success message
    } catch (error) {
      setMessage('Error fetching results: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (formatType) => {
    if (!videoUrls.length) {
      setMessage('No videos selected for download!');
      return;
    }
    
    setLoading(true);
    setMessage('Please wait...'); // Show loading message
    try {
      const response = await axios.post('http://localhost:5000/download', { videoUrls, formatType });
      setMessage('Download started!'); // Success message
      monitorProgress(response.data.downloadIds); // Start monitoring progress using download IDs
    } catch (error) {
      setMessage('Error starting download: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const monitorProgress = (downloadIds) => {
    const interval = setInterval(async () => {
      try {
        const progressResponses = await Promise.all(
          downloadIds.map((id) => axios.get(`http://localhost:5000/progress/${id}`))
        );

        const newProgress = {};
        progressResponses.forEach((res, index) => {
          newProgress[downloadIds[index]] = res.data.progress;
        });
        setDownloadProgress(newProgress);

        // Stop monitoring if all downloads are complete
        if (Object.values(newProgress).every((progress) => progress === 100)) {
          clearInterval(interval);
          setMessage('All downloads complete!'); // Final message when downloads complete
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }, 1000); // Update every second
  };

  const toggleVideoSelection = (videoUrl) => {
    setVideoUrls((prev) =>
      prev.includes(videoUrl) ? prev.filter((url) => url !== videoUrl) : [...prev, videoUrl]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setVideoUrls([]); // Deselect all
    } else {
      setVideoUrls(searchResults.map((result) => result.videoUrl)); // Select all
    }
    setSelectAll(!selectAll); // Toggle select all state
  };

  // Calculate the current results for the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  // Calculate total pages
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <Logo src={logo} alt="Logo" />
      </motion.div>

      <motion.div initial={{ x: -100 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100 }}>
        <SearchContainer>
          <SearchInput
            placeholder="Enter a keyword or video URL"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </SearchButton>
        </SearchContainer>
      </motion.div>

      {message && <Message>{message}</Message>} {/* Display messages */}

      <ResultsContainer>
        <ResultItem>
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectAll}
          />
          <span>Select All</span>
        </ResultItem>
        {currentResults.map((result) => (
          <ResultItem key={result.videoId}>
            <input
              type="checkbox"
              onChange={() => toggleVideoSelection(result.videoUrl)}
              checked={videoUrls.includes(result.videoUrl)}
            />
            <Thumbnail src={result.thumbnailUrl} alt={result.title} />
            <span>{result.title}</span>
            <Description>{result.description}</Description>
            {downloadProgress[result.videoId] !== undefined && (
              <ProgressBarContainer>
                <ProgressBar>
                  <ProgressFill progress={downloadProgress[result.videoId]} />
                </ProgressBar>
                <ProgressText>{downloadProgress[result.videoId]}%</ProgressText>
              </ProgressBarContainer>
            )}
          </ResultItem>
        ))}
      </ResultsContainer>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Pagination>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </Pagination>
      )}

      <DownloadSection>
        <DownloadTitle>Download Options</DownloadTitle>
        <DownloadOptions>
          <DownloadButton onClick={() => handleDownload('bestaudio')}>Audio Only</DownloadButton>
          <DownloadButton onClick={() => handleDownload('bestvideo')}>Video Only</DownloadButton>
          <CombinedDownloadButton onClick={() => handleDownload('best')}>Audio + Video</CombinedDownloadButton>
        </DownloadOptions>
      </DownloadSection>
    </Container>
  );
};

// Keyframes for background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  min-height: 100vh;
  width: 100vw;
  padding: 20px;
`;

const Logo = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 0px;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 1.2rem;
  width: 400px;
  border: 2px solid #ccc;
  border-radius: 5px;
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Message = styled.div`
  color: white;
  font-size: 1.2rem;
  margin: 10px 0;
  text-align: center;
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 10px 0;
  padding: 10px;
  width: 80%;
  color:black;
`;

const Thumbnail = styled.img`
  width: 120px;
  height: 80px;
  margin-right: 10px;
  border-radius: 5px;
`;

const Description = styled.p`
  flex-grow: 1;
  margin-left: 10px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const ProgressBar = styled.div`
  background: #eee;
  border-radius: 5px;
  overflow: hidden;
  height: 10px;
`;

const ProgressFill = styled.div`
  background: #4caf50;
  height: 100%;
  width: ${(props) => props.progress}%;
  transition: width 0.5s;
`;

const ProgressText = styled.span`
  font-size: 0.8rem;
  color: #333;
  margin-left: 10px;
`;

const Pagination = styled.div`
  margin: 20px 0;
  button {
    margin: 0 10px;
    padding: 5px 10px;
  }
`;

const DownloadSection = styled.div`
  margin-top: 30px;
  text-align: center;
`;

const DownloadTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const DownloadOptions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const DownloadButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CombinedDownloadButton = styled(DownloadButton)`
  background-color: #28a745;

  &:hover {
    background-color: #218838;
  }
`;

export default App;






// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import styled, { keyframes } from 'styled-components';
// import logo from './assets/removeytlogo.png'; // Ensure correct path for the logo

// const App = () => {
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearch = () => {
//     // Simulate fetching search results with YouTube thumbnails
//     setSearchResults([
//       { title: 'CCTV camera installation tutorial', videoId: 'abc123' },
//       { title: 'Hidden camera detection guide', videoId: 'def456' },
//       { title: 'Small camera setup', videoId: 'ghi789' },
//       { title: 'Security camera maintenance tips', videoId: 'jkl012' },
//     ]);
//   };

//   return (
//     <Container>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <Logo src={logo} alt="Logo" />
//       </motion.div>

//       <motion.div
//         initial={{ x: -100 }}
//         animate={{ x: 0 }}
//         transition={{ type: 'spring', stiffness: 100 }}
//       >
//         <SearchContainer>
//           <SearchInput placeholder="Enter any keyword or Type URL" />
//           <SearchButton onClick={handleSearch}>Search</SearchButton>
//         </SearchContainer>
//       </motion.div>

//       <ResultsContainer>
//         {searchResults.length > 0 &&
//           searchResults.map((result, index) => (
//             <ResultItem key={index}>
//               <Thumbnail
//                 src={'https://img.youtube.com/vi/${result.videoId}/0.jpg'}
//                 alt={result.title}
//               />
//               <ResultTitle>{result.title}</ResultTitle>
//             </ResultItem>
//           ))}
//       </ResultsContainer>

//       <motion.div
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.5 }}
//       >
//         <BrowseSection>
//           <BrowseTitle>Browse to the directory</BrowseTitle>
//           <BrowseButton>Browse</BrowseButton>
//         </BrowseSection>

//         <DownloadSection>
//           <DownloadTitle>Download this video</DownloadTitle>
//           <DownloadOptions>
//             <DownloadButton>Audio Download</DownloadButton>
//             <DownloadButton>Video Download</DownloadButton>
//           </DownloadOptions>
//           <CombinedDownloadButton>Audio + Video Download</CombinedDownloadButton>
//           <BulkDownloadButton>Bulk Download</BulkDownloadButton>
//         </DownloadSection>
//       </motion.div>
//     </Container>
//   );
// };

// // Keyframes for background animation
// const gradientAnimation = keyframes`
//   0% { background-position: 0% 50%; }
//   50% { background-position: 100% 50%; }
//   100% { background-position: 0% 50%; }
// `;

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
//   background-size: 400% 400%;
//   animation: ${gradientAnimation} 15s ease infinite;
//   min-height: 100vh;
//   width: 100vw;
//   padding: 20px;
// `;

// const Logo = styled.img`
//   width: 200px;
//   height: auto;
//   margin-bottom: 0px;
// `;

// const SearchContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-bottom: 30px;
//   width: 100%;
// `;

// const SearchInput = styled.input`
//   padding: 10px;
//   font-size: 1.2rem;
//   width: 400px;
//   border: 2px solid #ccc;
//   border-radius: 5px;
// `;

// const SearchButton = styled.button`
//   padding: 10px 20px;
//   margin-left: 10px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   font-size: 1.2rem;
//   cursor: pointer;
//   border-radius: 5px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const ResultsContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 20px;
//   width: 80%;
//   margin-bottom: 20px;
// `;

// const ResultItem = styled.div`
//   background-color: white;
//   padding: 15px;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   text-align: center;
// `;

// const Thumbnail = styled.img`
//   width: 100%;
//   height: auto;
//   border-radius: 5px;
//   margin-bottom: 10px;
// `;

// const ResultTitle = styled.div`
//   font-size: 1rem;
//   color: #333;
// `;

// const BrowseSection = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   background-color: white;
//   padding: 20px;
//   margin: 10px 0;
//   width: 500px;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
// `;

// const BrowseTitle = styled.h3`
//   color: #333;
// `;

// const BrowseButton = styled.button`
//   padding: 10px 20px;
//   background-color: #28a745;
//   color: white;
//   border: none;
//   cursor: pointer;
//   text-decoration: none;
//   border-radius: 5px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #218838;
//   }
// `;

// const DownloadSection = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-between;
//   background-color: white;
//   padding: 20px;
//   margin: 10px 0;
//   width: 500px;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
// `;

// const DownloadTitle = styled.h3`
//   color: #333;
// `;

// const DownloadOptions = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   margin-bottom: 10px;
// `;

// const DownloadButton = styled.button`
//   padding: 10px 15px;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   cursor: pointer;
//   text-decoration: none;
//   border-radius: 5px;
//   transition: background-color 0.3s;
//   flex: 1;
//   margin: 0 5px;

//   &:hover {
//     background-color: #0056b3;
//   }
// `;

// const CombinedDownloadButton = styled.button`
//   padding: 10px 15px;
//   background-color: #28a745;
//   color: white;
//   border: none;
//   cursor: pointer;
//   text-decoration: none;
//   border-radius: 5px;
//   transition: background-color 0.3s;
//   margin-bottom: 10px;

//   &:hover {
//     background-color: #218838;
//   }
// `;

// const BulkDownloadButton = styled.button`
//   padding: 10px 15px;
//   background-color: #dc3545;
//   color: white;
//   border: none;
//   cursor: pointer;
//   text-decoration: none;
//   border-radius: 5px;

//   &:hover {
//     background-color: #c82333;
//   }
// `;

// export default App;