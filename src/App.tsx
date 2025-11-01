import React from 'react';
import logo from './logo.svg';
import './App.css';
import RecipesList from './app/pages/RecipesList';
import CreateRecipe from './app/pages/CreateRecipe';
import CookRecipe from './app/pages/CookRecipe';
import MiniPlayer from './app/components/MiniPlayer';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
   <Router>
    <Routes>
      <Route path="/recipes" element={<RecipesList/>}/>
      <Route path="/create" element={<CreateRecipe/>}/>
      <Route path="/cook/:id" element={<CookRecipe/>}/>
    </Routes>
    <MiniPlayer/>
   </Router>
  );
}

export default App;
