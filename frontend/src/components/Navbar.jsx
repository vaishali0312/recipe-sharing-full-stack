import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import DarkModeToggle from "./DarkModeToggle";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/meal-planner", label: "Meal Planner" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/forum", label: "Forum" },
  ];

  const userLinks = [
    { to: "/create", label: "Create Recipe" },
    { to: "/favorites", label: "Favorites" },
  ];

  return (
    <nav className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-xl md:text-2xl font-bold text-orange-500">🍲 RecipeHub</Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-4 lg:gap-6 items-center">
        {navLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="hover:text-orange-500 transition text-sm lg:text-base text-gray-700 dark:text-gray-200"
          >
            {link.label}
          </Link>
        ))}
        
        {user && userLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="hover:text-orange-500 transition text-sm lg:text-base text-gray-700 dark:text-gray-200"
          >
            {link.label}
          </Link>
        ))}
        
        <DarkModeToggle />
        
        {user ? (
          <button 
            onClick={logout}
            className="bg-gray-200 dark:bg-gray-700 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm text-gray-700 dark:text-gray-200"
          >
            Logout
          </button>
        ) : (
          <Link 
            to="/login"
            className="bg-orange-500 text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-orange-600 transition text-sm"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 text-gray-700 dark:text-gray-200"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg md:hidden flex flex-col p-4 gap-3">
          {navLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="hover:text-orange-500 transition py-2 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          {user && userLinks.map((link) => (
            <Link 
              key={link.to} 
              to={link.to} 
              className="hover:text-orange-500 transition py-2 text-gray-700 dark:text-gray-200 border-b dark:border-gray-700"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-200">Theme</span>
            <DarkModeToggle />
          </div>
          
          {user ? (
            <button 
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-gray-700 dark:text-gray-200 text-left"
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
