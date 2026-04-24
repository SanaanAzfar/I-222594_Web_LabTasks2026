import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'https://api.coingecko.com/api/v3';
const CURRENCIES = ['usd', 'eur', 'gbp', 'inr'];

const App = () => {
  const [currency, setCurrency] = useState(() => localStorage.getItem('crypto_currency') || 'usd');
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('crypto_favorites')) || []);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    localStorage.setItem('crypto_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('crypto_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const code = pos.coords.country || '';
          if (code === 'GB') setCurrency('gbp');
          else if (code === 'DE' || code === 'FR' || code === 'IT' || code === 'ES') setCurrency('eur');
          else if (code === 'IN') setCurrency('inr');
        },
        () => {}
      );
    }
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <Router>
      <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 10 }}>Dashboard</Link>
          <Link to="/settings" style={{ marginRight: 10 }}>Settings</Link>
          {favorites.length > 0 && <span>Favorites: {favorites.length}</span>}
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard currency={currency} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/coin/:id" element={<CoinDetail currency={currency} favorites={favorites} toggleFavorite={toggleFavorite} />} />
          <Route path="/settings" element={<Settings currency={currency} setCurrency={setCurrency} favorites={favorites} setFavorites={setFavorites} />} />
        </Routes>
      </div>
    </Router>
  );
};

const Dashboard = ({ currency, favorites, toggleFavorite }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const navigate = useNavigate();

  const fetchCoins = () => {
    setLoading(true);
    fetch(`${API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1&sparkline=false`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setCoins(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, [currency]);

  if (loading && coins.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error} <button onClick={fetchCoins}>Retry</button></div>;

  let filtered = coins.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
    if (sortBy === 'price') return b.current_price - a.current_price;
    if (sortBy === 'change') return (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0);
    return b.market_cap - a.market_cap;
  });

  return (
    <div>
      <input placeholder="Search coins..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginRight: 10 }} />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ marginRight: 10 }}>
        <option value="market_cap">Market Cap</option>
        <option value="price">Price</option>
        <option value="change">24h Change</option>
      </select>
      <select value={currency} onChange={e => { localStorage.setItem('crypto_currency', e.target.value); window.location.reload(); }}>
        {CURRENCIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
      </select>

      {loading && <div style={{ color: '#666' }}>Refreshing...</div>}

      <div style={{ marginTop: 20 }}>
        {filtered.map(coin => (
          <PriceCard key={coin.id} coin={coin} currency={currency} isFav={favorites.includes(coin.id)} onToggleFav={toggleFavorite} onClick={() => navigate(`/coin/${coin.id}`)} />
        ))}
      </div>
    </div>
  );
};

const PriceCard = ({ coin, currency, isFav, onToggleFav, onClick }) => {
  const change = coin.price_change_percentage_24h || 0;
  const color = change >= 0 ? 'green' : 'red';

  return (
    <div style={{ border: '1px solid #ddd', padding: 10, margin: '5px 0', cursor: 'pointer' }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{coin.name}</strong> ({coin.symbol.toUpperCase()})
          <div>Rank: #{coin.market_cap_rank}</div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onToggleFav(coin.id); }}>{isFav ? '★' : '☆'}</button>
      </div>
      <div style={{ fontSize: 18, fontWeight: 'bold' }}>
        {currency.toUpperCase()} {coin.current_price?.toLocaleString()}
      </div>
      <div style={{ color }}>
        {change >= 0 ? '+' : ''}{change?.toFixed(2)}%
      </div>
    </div>
  );
};

const CoinDetail = ({ currency, favorites, toggleFavorite }) => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/coins/${id}`)
      .then(res => res.json())
      .then(data => {
        setCoin(data);
        setError(null);
      })
      .catch(() => setError('Failed to load coin'))
      .finally(() => setLoading(false));
  }, [id, currency]);

  if (loading) return <div>Loading...</div>;
  if (error || !coin) return <div>Error loading coin</div>;

  const marketData = coin.market_data;
  const change = marketData?.price_change_percentage_24h || 0;
  const color = change >= 0 ? 'green' : 'red';

  return (
    <div>
      <Link to="/">Back</Link>
      <h1>{coin.name} ({coin.symbol?.toUpperCase()})</h1>
      <button onClick={() => toggleFavorite(coin.id)}>{favorites.includes(coin.id) ? '★ Unfavorite' : '☆ Favorite'}</button>

      <p>Current Price: {currency.toUpperCase()} {marketData?.current_price?.[currency]?.toLocaleString()}</p>
      <p style={{ color }}>24h Change: {change >= 0 ? '+' : ''}{change?.toFixed(2)}%</p>
      <p>Market Cap Rank: #{coin.market_cap_rank}</p>
      <p>24h High: {currency.toUpperCase()} {marketData?.high_24h?.[currency]?.toLocaleString()}</p>
      <p>24h Low: {currency.toUpperCase()} {marketData?.low_24h?.[currency]?.toLocaleString()}</p>
      <p>All-Time High: {currency.toUpperCase()} {marketData?.ath?.[currency]?.toLocaleString()}</p>
      <p>All-Time Low: {currency.toUpperCase()} {marketData?.atl?.[currency]?.toLocaleString()}</p>
      <p>Circulating Supply: {marketData?.circulating_supply?.toLocaleString()} {coin.symbol?.toUpperCase()}</p>
      <p>Total Supply: {marketData?.total_supply?.toLocaleString()} {coin.symbol?.toUpperCase()}</p>

      {coin.description?.en && <p style={{ marginTop: 20 }}>{coin.description.en.substring(0, 300)}...</p>}
    </div>
  );
};

const Settings = ({ currency, setCurrency, favorites, setFavorites }) => {
  return (
    <div>
      <h2>Settings</h2>
      <label>Preferred Currency: </label>
      <select value={currency} onChange={e => setCurrency(e.target.value)}>
        {CURRENCIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
      </select>

      <h3>Favorite Coins</h3>
      {favorites.length === 0 ? <p>No favorites saved.</p> : (
        <ul>
          {favorites.map(fid => (
            <li key={fid}>
              {fid} <button onClick={() => setFavorites(favorites.filter(f => f !== fid))}>Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;