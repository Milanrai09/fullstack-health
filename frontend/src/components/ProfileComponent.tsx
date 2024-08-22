import { Link , useNavigate} from 'react-router-dom';


const ProfileComponent = () => {
  const navigate = useNavigate();


    const handleLogout = () => {
        localStorage.removeItem('healthToken');
        navigate('/', { replace: true });
      
        window.location.reload();
  };
  
    return (
      <div className='profile-container'>
        <h2>Profile</h2>
        <ul className="profile-links">

          <li>
            <Link to="/create-article">Create Article</Link>
          </li>
          <li>
            <Link to="/your-articles">Your Articles</Link>
          </li>
          <li>
            <Link to="/saved">Saved</Link>
          </li>
        </ul>
        <div className="profile-options">

          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
}

export default ProfileComponent
