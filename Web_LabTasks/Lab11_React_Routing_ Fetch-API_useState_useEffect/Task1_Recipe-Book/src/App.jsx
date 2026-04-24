import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

const recipesData = [
  { id: 1, name: "Spaghetti Carbonara", cuisine: "Italian", prepTime: 20, difficulty: "Medium", image: "https://images.pexels.com/photos/12116165/pexels-photo-12116165.png", description: "Creamy pasta.", rating: 4.6, ingredients: ["200g spaghetti", "100g pancetta", "2 eggs", "50g pecorino", "Pepper"], instructions: ["Boil pasta.", "Fry pancetta.", "Mix eggs/cheese.", "Combine.", "Serve."], reviews: [{ id: 1, user: "User1", comment: "Good", rating: 5 }] },
  { id: 2, name: "Tacos", cuisine: "Mexican", prepTime: 15, difficulty: "Easy", image: "https://images.pexels.com/photos/33614212/pexels-photo-33614212.jpeg", description: "Beef tacos.", rating: 4.8, ingredients: ["Shells", "Beef", "Lettuce", "Cheese"], instructions: ["Cook beef.", "Warm shells.", "Assemble."], reviews: [] },
  { id: 3, name: "Sushi Roll", cuisine: "Japanese", prepTime: 45, difficulty: "Hard", image: "https://images.pexels.com/photos/17584799/pexels-photo-17584799.jpeg", description: "Fresh sushi.", rating: 4.9, ingredients: ["Rice", "Nori", "Fish", "Avocado"], instructions: ["Cook rice.", "Roll.", "Cut."], reviews: [] },
  { id: 4, name: "Burger", cuisine: "American", prepTime: 25, difficulty: "Medium", image: "https://images.pexels.com/photos/29368033/pexels-photo-29368033.jpeg?_gl=1*1o0dttv*_ga*NDE0ODAyNjY2LjE3NzcwMDQ5OTY.*_ga_8JE65Q40S6*czE3NzcwMDQ5OTYkbzEkZzEkdDE3NzcwMDUwMDUkajUxJGwwJGgw", description: "Classic burger.", rating: 4.2, ingredients: ["Bun", "Patty", "Cheese", "Lettuce"], instructions: ["Grill patty.", "Toast bun.", "Assemble."], reviews: [] },
  { id: 5, name: "Curry", cuisine: "Indian", prepTime: 40, difficulty: "Medium", image: "https://images.pexels.com/photos/31029754/pexels-photo-31029754.jpeg?_gl=1*16xsmc5*_ga*NDE0ODAyNjY2LjE3NzcwMDQ5OTY.*_ga_8JE65Q40S6*czE3NzcwMDQ5OTYkbzEkZzEkdDE3NzcwMDUwODAkajM4JGwwJGgw", description: "Spicy curry.", rating: 4.5, ingredients: ["Chicken", "Spices", "Rice", "Onion"], instructions: ["Fry onion.", "Add spices.", "Simmer chicken.", "Serve with rice."], reviews: [] },
  { id: 6, name: "Salad", cuisine: "American", prepTime: 10, difficulty: "Easy", image: "https://images.pexels.com/photos/14090828/pexels-photo-14090828.jpeg", description: "Healthy salad.", rating: 3.5, ingredients: ["Lettuce", "Tomato", "Dressing"], instructions: ["Chop veggies.", "Mix."], reviews: [] }
];

const App = () => {
  const [mealPlan, setMealPlan] = useState(() => JSON.parse(localStorage.getItem('mealPlan')) || []);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const addToPlan = (id) => {
    if (!mealPlan.includes(id)) setMealPlan([...mealPlan, id]);
  };

  const removeFromPlan = (id) => {
    setMealPlan(mealPlan.filter(pid => pid !== id));
  };

  return (
    <Router>
      <div style={{ padding: 20 }}>
        <nav style={{ marginBottom: 20 }}>
          <Link to="/" style={{ marginRight: 10 }}>Home</Link>
          <Link to="/recipes" style={{ marginRight: 10 }}>Recipes</Link>
          <Link to="/meal-plan">Meal Plan ({mealPlan.length})</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<RecipeListContainer />} />
          <Route path="/recipes/:id" element={<RecipeDetail mealPlan={mealPlan} addToPlan={addToPlan} removeFromPlan={removeFromPlan} />} />
          <Route path="/meal-plan" element={<MealPlanDisplay mealPlanIds={mealPlan} removeFromPlan={removeFromPlan} />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => (
  <div>
    <h1>Welcome to Recipe Book</h1>
    <p>Featured recipes below.</p>
    <div style={{ display: 'flex', gap: 10 }}>
      {recipesData.slice(0, 3).map(r => (
        <div key={r.id} style={{ border: '1px solid #ccc', padding: 10 }}>
          <h3>{r.name}</h3>
          <Link to={`/recipes/${r.id}`}>View</Link>
        </div>
      ))}
    </div>
  </div>
);

const RecipeListContainer = () => {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setTimeout(() => {
      setRecipes(recipesData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div>Loading...</div>;

  let filtered = recipes.filter(r =>
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisine.toLowerCase().includes(search.toLowerCase())) &&
    (cuisineFilter === "All" || r.cuisine === cuisineFilter) &&
    (diffFilter === "All" || r.difficulty === diffFilter)
  );

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prepTime') return a.prepTime - b.prepTime;
    return a.name.localeCompare(b.name);
  });

  const cuisines = ["All", ...new Set(recipes.map(r => r.cuisine))];
  const diffs = ["All", "Easy", "Medium", "Hard"];

  return (
    <div>
      <h2>All Recipes</h2>
      <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginRight: 10 }} />
      <select value={cuisineFilter} onChange={e => setCuisineFilter(e.target.value)} style={{ marginRight: 10 }}>
        {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} style={{ marginRight: 10 }}>
        {diffs.map(d => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
        <option value="name">Name</option>
        <option value="rating">Rating</option>
        <option value="prepTime">Prep Time</option>
      </select>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 20 }}>
        {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
      </div>
    </div>
  );
};

const RecipeCard = ({ recipe }) => (
  <div style={{ border: '1px solid #ddd', padding: 10 }}>
    <img src={recipe.image} alt={recipe.name} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
    <h3>{recipe.name}</h3>
    <p>{recipe.cuisine} | {recipe.difficulty} | {recipe.prepTime}m</p>
    <p>Rating: {recipe.rating}</p>
    <Link to={`/recipes/${recipe.id}`}>Details</Link>
  </div>
);

const RecipeDetail = ({ mealPlan, addToPlan, removeFromPlan }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    setTimeout(() => {
      const found = recipesData.find(r => r.id === parseInt(id));
      if (found) {
        setRecipe(found);
        setReviews(found.reviews || []);
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddReview = () => {
    if (!newComment) return;
    const rev = { id: Date.now(), user: "Guest", comment: newComment, rating: parseFloat(newRating) };
    setReviews([...reviews, rev]);
    setNewComment("");
  };

  if (loading) return <div>Loading...</div>;
  if (!recipe) return <div>Not Found</div>;

  const inPlan = mealPlan.includes(recipe.id);

  return (
    <div>
      <Link to="/recipes">Back</Link>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      <p>Cuisine: {recipe.cuisine} | Difficulty: {recipe.difficulty} | Time: {recipe.prepTime} mins</p>

      <button onClick={() => inPlan ? removeFromPlan(recipe.id) : addToPlan(recipe.id)}>
        {inPlan ? "Remove from Meal Plan" : "Add to Meal Plan"}
      </button>

      <h3>Ingredients</h3>
      <ul>{recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}</ul>

      <h3>Instructions</h3>
      <ol>{recipe.instructions.map((inst, i) => <li key={i}>{inst}</li>)}</ol>

      <h3>Reviews</h3>
      {reviews.map(rev => (
        <div key={rev.id} style={{ borderBottom: '1px solid #eee', padding: 5 }}>
          <strong>{rev.user}</strong>: {rev.comment} ({rev.rating}/5)
        </div>
      ))}

      <div style={{ marginTop: 10 }}>
        <input placeholder="Comment" value={newComment} onChange={e => setNewComment(e.target.value)} />
        <select value={newRating} onChange={e => setNewRating(e.target.value)}>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
        <button onClick={handleAddReview}>Add Review</button>
      </div>
    </div>
  );
};

const MealPlanDisplay = ({ mealPlanIds, removeFromPlan }) => {
  const planRecipes = recipesData.filter(r => mealPlanIds.includes(r.id));

  return (
    <div>
      <h2>Weekly Meal Plan</h2>
      {planRecipes.length === 0 ? <p>No meals planned.</p> : (
        <div>
          {planRecipes.map(r => (
            <div key={r.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10, display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.name}</span>
              <button onClick={() => removeFromPlan(r.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;