import { useState, useEffect } from 'react';
import { useGetAllUsers } from "../hooks/userHooks";
import { deleteUser, demoteUser, promoteUser } from '../hooks/adminHooks';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AdminUserSubPage = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(false);

  useEffect(() => {
    fetchUsers();

    const healthToken = localStorage.getItem('healthToken');
    if (healthToken) {
      const parsedData = JSON.parse(healthToken);
      if (parsedData.isSuperAdmin) {
        setIsSuperAdmin(true);
      }}
  }, []);

  const fetchUsers = async (): Promise<void> => {
    try {
      const data: UserInfo[] = await useGetAllUsers();
      setUsers(data);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleDeleteUser = (id: string): void => {
    deleteUser(id);
  };

  const handleDemoteUser = (id: string): void => {
    demoteUser(id)
  };

  const handlePromoteUser = (id: string): void => {
    promoteUser(id)
  };



  return (
    <div className="admin-users-container">
      <h1>Users</h1>
      {users.map((user: UserInfo) => (
        <div key={user._id} className="user-card">
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <p className="user-roles">
            Admin: {user.isAdmin ? 'Yes' : 'No'}
            {user.isSuperAdmin !== undefined && ` | Super Admin: ${user.isSuperAdmin ? 'Yes' : 'No'}`}
          </p>

          <div className="updatebuttons">
              <button 
                className="delete-button"
                onClick={() => handlePromoteUser(user._id)}
              >
                Promote
              </button>
              {isSuperAdmin?
              <button 
                className="delete-button"
                onClick={() => handleDemoteUser(user._id)}
              >
                Demote
              </button>:''}
              <button 
                className="delete-button"
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUserSubPage;