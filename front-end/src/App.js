import './App.css';

import SignUpPage from './pages/SignUp/index.jsx'
import LogInPage from './pages/LogIn/index.jsx'
import HomePage from './pages/Home/index.jsx'
import LandingPage from './pages/LandingPage/index.jsx'

import LandingLayout from './components/LandingLayout';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import SearchRecipe from './pages/SearchRecipe';
import CreateRecipe from './pages/CreateRecipe';
import EditProfile from './pages/EditProfile';
import ShoppingList from './pages/ShoppingList';
import RecipeInfo from './pages/RecipeInfo';
import MyRecipes from './pages/MyRecipes';
import LogoutPage from './pages/Logout';
import EditRecipe from './pages/EditRecipe';

// react router dom
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingLayout />}>
          <Route path='/' element={<LandingPage />}></Route>
          <Route path="/signup" element={<SignUpPage />}></Route>
          <Route path="/login" element={<LogInPage />}></Route>
        </Route>
        <Route path="/" element={<AuthenticatedLayout />}>
          <Route path='/home' element={<HomePage />}></Route>
          <Route path='/search' element={<SearchRecipe />}></Route>
          <Route path='/create' element={<CreateRecipe />}></Route>
          <Route path='/profile/edit' element={<EditProfile />}></Route>
          <Route path='/shoppinglist' element={<ShoppingList />}></Route>
          <Route path='/myrecipes' element={<MyRecipes />}></Route>
          <Route path='/recipeinfo/:recipe_id' element={<RecipeInfo />}></Route>
          <Route path='/recipeinfo/:recipe_id/edit' element={<EditRecipe />}></Route>
        </Route>
        <Route path='/logout' element={<LogoutPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
