import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';
import ProfileComponent from './components/ProfileComponent';
// import Cookies from 'js-cookie';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });
  const [profile, setProfile] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      // const tokenCookie = Cookies.get('token');
      // if (tokenCookie) {
        const healthToken = localStorage.getItem('healthToken');
        if (healthToken) {
          setIsAuthenticated(true);
          setProfile(true);
          const parsedData = JSON.parse(healthToken);
          if (parsedData.isAdmin) {
            setIsAdmin(true);
          }
        }
    //   } else {
    //     localStorage.removeItem('healthToken');
    //     setIsAuthenticated(false);
    //     setProfile(false);
    //     setIsAdmin(false);
    //   }
    };

    
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };






  const toggleProfile = () => {
    setProfile(!profile);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
  <div className="home-container">
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {!profile && <ProfileComponent />}
      <header className='App-header'>
        <div className="logo">Health-Hub</div>
        <nav className="article-link">
          <Link to="/">Home</Link>
          <Link to="/article">Article</Link>
          <Link to="/ai">AI</Link>
          <Link to="/about">About</Link>
          <button onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link className='admin-panel' to="/admin">Admin Panel</Link>}
              <button onClick={toggleProfile}>Profile</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
        <button className="menu-toggle" onClick={toggleMenu}>
          Menu
        </button>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/article" onClick={toggleMenu}>Article</Link>
        <Link to="/ai" onClick={toggleMenu}>AI</Link>
        <Link to="/about" onClick={toggleMenu}>About</Link>
        <button onClick={() => { toggleDarkMode(); toggleMenu(); }}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        {isAuthenticated ? (
          <>
            {isAdmin && <Link to="/admin" onClick={toggleMenu}>Admin Panel</Link>}
            <button onClick={() => { toggleProfile(); toggleMenu(); }}>Profile</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={toggleMenu}>Login</Link>
            <Link to="/register" onClick={toggleMenu}>Register</Link>
          </>
        )}
      </div>

      <main className='App-main '>
        <Outlet />
      </main>

      <footer className='App-footer '>
      <footer className='App-footer'>
  <div className="footer-content">
    <div className="footer-section">
      <h3>About Us</h3>
      <p>We are dedicated to providing high-quality nutrition  information and services to help you lead a healthier life.</p>
    </div>
    <div className="footer-section">
      <h3>Quick Links</h3>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/articles">Articles</Link></li>
        <li><Link to="/ai">AI Tools</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </div>
    <div className="footer-section">
      <h3>Contact Us</h3>
      <p>Email: info@example.com</p>
      <p>Phone: (123) 456-7890</p>
      <p>Address: 123 Nutrition St, Health City, HC 12345</p>
    </div>
    <div className="footer-section">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <a href="#" className="social-icon">FB</a>
        <a href="#" className="social-icon">TW</a>
        <a href="#" className="social-icon">IG</a>
        <a href="#" className="social-icon">LI</a>
      </div>
    </div>
  </div>
  <div className="footer-bottom">
    <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
  </div>
</footer>
      </footer>  
        </div>
    </div>
  );
}

export default App;