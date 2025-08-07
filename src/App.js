import React, { useState } from 'react';
import './App.css';

const API_KEY = '9dee9d91';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false); // Trigger animation

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResults([]);
    setSelectedMovie(null);
    setSearchClicked(true); // Trigger header and search bar to move up

    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await res.json();
      if (data.Response === 'True') {
        setResults(data.Search);
      } else {
        setError(data.Error || 'No results found');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (imdbID) => {
    setLoading(true);
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}`);
      const data = await res.json();
      setSelectedMovie(data);
    } catch {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`App ${searchClicked ? 'moved' : ''}`}>
      <h1 className={`${searchClicked ? 'moved' : ''}`}>Explorer</h1>

      {/* Search Bar */}
      <div className={`search-bar ${searchClicked ? 'moved' : ''}`}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchMovies();
            }
          }}
          
        />
        <button onClick={searchMovies}><i className="fa fa-search"></i></button>
      </div>

      {loading && (
  <div className="spinner-container">
    <div className="spinner">Loading...</div>
  </div>
)}

{error && <p className="error-message">{error}</p>}




      {!selectedMovie && (
        <div className="movie-grid">
          {results.map((movie) => (
            <div key={movie.imdbID} className="movie-item" onClick={() => getMovieDetails(movie.imdbID)}>
              <img src={movie.Poster} alt={movie.Title} />
              <p>{movie.Title}</p>
            </div>
          ))}
        </div>
      )}

{selectedMovie && (
  <div className="movie-details">
    <h2>{selectedMovie.Title} ({selectedMovie.Year})</h2>
    <img src={selectedMovie.Poster} alt={selectedMovie.Title} className="poster" />
    <div className="movie-info">
      <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
      <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
      <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
      <p className='imdb'><strong>IMDB Rating:</strong> {selectedMovie.imdbRating}</p>
    </div>
    <button onClick={() => setSelectedMovie(null)}>Back</button>
  </div>
)}

    </div>
  );
}

export default App;
