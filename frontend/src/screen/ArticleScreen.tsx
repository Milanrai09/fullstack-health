import { Link, Outlet } from "react-router-dom"

const ArticleScreen = () => {
  return (
<div className="article-Container">


    <div className="article-header">
        <ul>

            <li>
                <Link to='popular'>Popular</Link>
            </li>
            <li>
                <Link to='mental-health'>Mental Health</Link>
            </li>
            <li>
                <Link to="diet">Diet</Link>
            </li>

            <li>
                <Link to='fitness'>Fitness</Link>
            </li>

            <li>
                <Link to='healthy-lifestyle'>Health Lifestyle</Link>
            </li>
        </ul>
    </div>

    <div className="article-main">
        <Outlet/>
    </div>
    
    
    </div>


  )
}

export default ArticleScreen
