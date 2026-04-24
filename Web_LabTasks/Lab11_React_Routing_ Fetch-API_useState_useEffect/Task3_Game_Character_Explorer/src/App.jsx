import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const API = 'https://rickandmortyapi.com/api';

const App = () => {
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 10 }}>Characters</Link>
          <Link to="/classes" style={{ marginRight: 10 }}>Locations</Link>
          <Link to="/favorites">Favorites ({favorites.length})</Link>
        </nav>
        <Routes>
          <Route path="/" element={<CharacterList favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/character/:id" element={<CharacterDetail favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/favorites" element={<FavoriteCharacters favorites={favorites} toggleFavorite={toggleFavorite} />} />
        </Routes>
      </div>
    </Router>
  );
};

const CharacterList = ({ favorites, toggleFavorite }) => {
  const [characters, setCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [species, setSpecies] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.append('name', search);
    if (status) params.append('status', status);
    if (species) params.append('species', species);
    params.append('page', page);

    fetch(`${API}/character/?${params}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setCharacters(data.results);
        setInfo(data.info);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, status, species, page]);

  if (loading && characters.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <SearchBar search={search} setSearch={setSearch} />
      <FilterPanel status={status} setStatus={setStatus} species={species} setSpecies={setSpecies} setPage={setPage} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15, marginTop: 20 }}>
        {characters.map(char => (
          <CharacterCard key={char.id} char={char} isFav={favorites.includes(char.id)} onToggle={() => toggleFavorite(char.id)} />
        ))}
      </div>

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <button disabled={!info.prev} onClick={() => setPage(p => p - 1)}>Previous</button>
        <span>Page {info.current || 1}</span>
        <button disabled={!info.next} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
};

const SearchBar = ({ search, setSearch }) => (
  <input
    placeholder="Search by name..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    style={{ width: '100%', padding: 8, marginBottom: 10 }}
  />
);

const FilterPanel = ({ status, setStatus, species, setSpecies, setPage }) => (
  <div style={{ marginBottom: 15 }}>
    <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ marginRight: 10 }}>
      <option value="">All Status</option>
      <option value="Alive">Alive</option>
      <option value="Dead">Dead</option>
      <option value="unknown">Unknown</option>
    </select>
    <select value={species} onChange={e => { setSpecies(e.target.value); setPage(1); }}>
      <option value="">All Species</option>
      <option value="Human">Human</option>
      <option value="Alien">Alien</option>
      <option value="Robot">Robot</option>
    </select>
  </div>
);

const CharacterCard = ({ char, isFav, onToggle }) => (
  <div style={{ border: '1px solid #ccc', padding: 10, borderRadius: 5 }}>
    <Link to={`/character/${char.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src={char.image} alt={char.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 5 }} />
      <h3 style={{ margin: '10px 0 5px' }}>{char.name}</h3>
    </Link>
    <p>Status: {char.status === 'Alive' ? '🟢' : char.status === 'Dead' ? '⚰️' : '❓'} {char.status}</p>
    <p>Species: {char.species}</p>
    <button onClick={onToggle} style={{ marginTop: 5 }}>{isFav ? '❤️' : '🤍'}</button>
  </div>
);

const CharacterDetail = ({ favorites, toggleFavorite }) => {
  const { id } = useParams();
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/character/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setChar(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !char) return <div>Character not found</div>;

  return (
    <div>
      <Link to="/">← Back</Link>
      <div style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <img src={char.image} alt={char.name} style={{ width: 300, height: 300, objectFit: 'cover', borderRadius: 10 }} />
        <div>
          <h1>{char.name}</h1>
          <p>Status: {char.status === 'Alive' ? '🟢' : char.status === 'Dead' ? '⚰️' : '❓'} {char.status}</p>
          <p>Species: {char.species}</p>
          <p>Gender: {char.gender}</p>
          <p>Origin: {char.origin.name}</p>
          <p>Location: {char.location.name}</p>
          <button onClick={() => toggleFavorite(char.id)} style={{ marginTop: 10, padding: '10px 20px' }}>
            {favorites.includes(char.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  );
};
const Classes = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/location`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch locations');
        return res.json();
      })
      .then(data => {
        setLocations(data.results || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading locations...</div>;
  if (error) return <div>Error: {error}</div>;
  if (locations.length === 0) return <div>No locations found.</div>;

  return (
    <div>
      <h2>Locations</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 15 }}>
        {locations.map(loc => (
          <div key={loc.id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 5 }}>
            <h3>{loc.name}</h3>
            <p>Type: {loc.type}</p>
            <p>Dimension: {loc.dimension}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const FavoriteCharacters = ({ favorites, toggleFavorite }) => {
  const [favChars, setFavChars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(favorites.map(id => fetch(`${API}/character/${id}`).then(res => res.json())))
      .then(data => setFavChars(data))
      .finally(() => setLoading(false));
  }, [favorites]);

  if (loading) return <div>Loading...</div>;
  if (favChars.length === 0) return <div>No favorites yet!</div>;

  return (
    <div>
      <h2>Your Favorites</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 15 }}>
        {favChars.map(char => (
          <CharacterCard key={char.id} char={char} isFav={true} onToggle={() => toggleFavorite(char.id)} />
        ))}
      </div>
    </div>
  );
};

export default App;