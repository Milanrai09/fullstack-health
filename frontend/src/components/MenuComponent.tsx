import { Link } from 'react-router-dom';

interface MenuComponentProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  toggleProfile: () => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  darkMode,
  toggleDarkMode,
  isAuthenticated,
  isAdmin,
  toggleProfile,
}) => {
  return (
    <div className="menu-component">
      <header className="App-header">
        <div className="logo">Logo</div>
        <nav className="article-link">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/article">Article</Link>
            </li>
            <li>
              <Link to="/ai">AI</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav>
        <div className="mode">
          <button onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        {isAuthenticated ? (
          <>
            {isAdmin && (
              <div className="admin-panel">
                <Link to="/admin">Admin Panel</Link>
              </div>
            )}
            <div className="menu">
              <button onClick={toggleProfile}>Profile</button>
            </div>
          </>
        ) : (
          <div className="signinRegister">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </header>
    </div>
  );
};

export default MenuComponent;