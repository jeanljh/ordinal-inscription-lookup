import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [results, setResults] = useState([]);
  const [clicked, setClicked] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleLookup = () => {
    // Reset the search results and flags when a new search is performed
    setResults([]);
    setClicked(null);
    setSearchPerformed(false);
    setSearching(true);

    // Call the API with the entered bitcoin address
    fetch(`https://api-3.xverse.app/v1/address/${bitcoinAddress}/ordinal-utxo`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.results || data.results.length < 1) {
          throw new Error('No results');
        }
        // Get the inscriptions IDs from the API response
        const inscriptionIds = data.results.map((result) => result.inscriptions[0].id);
        setResults(inscriptionIds);
        setSearchPerformed(true);
        setSearching(false);
      })
      .catch((error) => {
        console.error({error});
        setSearchPerformed(true);
        setSearching(false);
      });
  };

  const handleClick = (index) => {
    setClicked(index);
  };

  return (
    <div className="App">
      <h1>Ordinal Inscription Lookout</h1>
      <label>Owner Bitcoin Address:</label>
      <input
        type="text"
        value={bitcoinAddress}
        onChange={(e) => setBitcoinAddress(e.target.value)}
      />
      <button onClick={handleLookup}>Look up</button>
      <div>
      { searchPerformed && results.length > 0 && <h2>Results</h2> }
      {
        searching ? <div className='status'>Searching...</div> : 
        searchPerformed && results.length > 0 && results.map((inscriptionId, index) =>
          <div
            className={`group ${clicked === index ? 'clicked' : ''}`}
            key={index}
            onClick={() => handleClick(index)}
          > Inscription {inscriptionId.slice(0, 8)} {clicked === index && <span>Clicked</span>}
          </div>
        )
      }
      {
        searchPerformed && results.length < 1 && !searching && 
        <div className='status'>No Inscription IDs found</div>
      }
      </div>
    </div>
  );
};

export default App;
