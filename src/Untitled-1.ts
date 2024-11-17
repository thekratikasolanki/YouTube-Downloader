
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import styled from 'styled-components';
// import logo from './assets/removeytlogo.png'; // Ensure correct path for the logo
// // import Particles from './components/Particles';


// const App = () => {
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearch = () => {
//     // Simulate fetching search results
//     setSearchResults([
//       'Result 1: CCTV camera installation tutorial',
//       'Result 2: Hidden camera detection guide',
//       'Result 3: Small camera setup'
//     ]);
//   };

//   return (

//     <Container>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         {/* Logo section */}
//         <Logo src={logo} alt="Logo" />
//         {/* <Title>My YouTube Downloader Bot</Title> */}
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

//       {/* Display Search Results */}
//       <ResultsContainer>
//         {searchResults.length > 0 && searchResults.map((result, index) => (
//           <ResultItem key={index}>{result}</ResultItem>
//         ))}
//       </ResultsContainer>

//       {/* Browse and Download Section */}
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
          
//           {/* Audio and Video Download Options */}
//           <DownloadOptions>
//             <DownloadButton>Audio Download</DownloadButton>
//             <DownloadButton>Video Download</DownloadButton>
//           </DownloadOptions>

//           {/* Combined Download Button */}
//           <CombinedDownloadButton>Audio + Video Download</CombinedDownloadButton>

//           {/* Bulk Download Button */}
//           <BulkDownloadButton>Bulk Download</BulkDownloadButton>
//         </DownloadSection>
//       </motion.div>
//     </Container>
    
//   );
// };

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   ${'' /* background-color: red; */}
//   backgroundImage: "src('')",
//   min-height: 100vh;
//   width: 100vw;
//   padding: 20px;

// `;

// const Logo = styled.img`
//   width: 200px;
//   height: auto;
//   margin-bottom: 0px;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   color: #333;
//   margin-bottom: 20px;
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
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   width: 80%;
//   margin-bottom: 20px;
// `;

// const ResultItem = styled.div`
//   background-color: white;
//   padding: 15px;
//   margin: 10px 0;
//   width: 100%;
//   text-align: left;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   font-size: 1.2rem;
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








import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import logo from './assets/removeytlogo.png'; // Ensure correct path for the logo

const App = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    // Simulate fetching search results
    setSearchResults([
      'Result 1: CCTV camera installation tutorial',
      'Result 2: Hidden camera detection guide',
      'Result 3: Small camera setup',
    ]);
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Logo src={logo} alt="Logo" />
      </motion.div>

      <motion.div
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <SearchContainer>
          <SearchInput placeholder="Enter any keyword or Type URL" />
          <SearchButton onClick={handleSearch}>Search</SearchButton>
        </SearchContainer>
      </motion.div>

      <ResultsContainer>
        {searchResults.length > 0 &&
          searchResults.map((result, index) => (
            <ResultItem key={index}>{result}</ResultItem>
          ))}
      </ResultsContainer>

      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <BrowseSection>
          <BrowseTitle>Browse to the directory</BrowseTitle>
          <BrowseButton>Browse</BrowseButton>
        </BrowseSection>

        <DownloadSection>
          <DownloadTitle>Download this video</DownloadTitle>
          <DownloadOptions>
            <DownloadButton>Audio Download</DownloadButton>
            <DownloadButton>Video Download</DownloadButton>
          </DownloadOptions>
          <CombinedDownloadButton>Audio + Video Download</CombinedDownloadButton>
          <BulkDownloadButton>Bulk Download</BulkDownloadButton>
        </DownloadSection>
      </motion.div>
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

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-bottom: 20px;
`;

const ResultItem = styled.div`
  background-color: white;
  padding: 15px;
  margin: 10px 0;
  width: 100%;
  text-align: left;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 1.2rem;
`;

const BrowseSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 20px;
  margin: 10px 0;
  width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BrowseTitle = styled.h3`
  color: #333;
`;

const BrowseButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const DownloadSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 20px;
  margin: 10px 0;
  width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DownloadTitle = styled.h3`
  color: #333;
`;

const DownloadOptions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
`;

const DownloadButton = styled.button`
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  flex: 1;
  margin: 0 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CombinedDownloadButton = styled.button`
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  margin-bottom: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const BulkDownloadButton = styled.button`
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 5px;

  &:hover {
    background-color: #c82333;
  }
`;

export default App;