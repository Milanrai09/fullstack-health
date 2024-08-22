

import { useEffect, useState } from "react"
import { Link, Outlet } from "react-router-dom"


const AdminScreen = () => {

    const [isAdmin, setIsAdmin] = useState<boolean | null>(false);

    useEffect(() => {
  
      const healthToken = localStorage.getItem('healthToken');
      if (healthToken) {
        const parsedData = JSON.parse(healthToken);
        if (parsedData.isAdmin) {
          setIsAdmin(true);
        }}
    }, []);
  


  return (
    
 isAdmin?(<div className="article-Container">


    <div className="article-header">
        <ul>
       
            <li>
                <Link to='adminUser'>User</Link>
            </li>
            <li>
                <Link to='adminArticle'>Articles</Link>
            </li>
            <li>
                <Link to="adminCreateApprove">Approve Artilces</Link>
            </li>

            <li>
                <Link to='adminEditApprove'>Approve Edit Articles</Link>
            </li>

        </ul>
    </div>

    <div className="article-main">
        <Outlet/>
    </div>
    
    
    </div>):('You are not authroize to access this page')

  )
}

export default AdminScreen
