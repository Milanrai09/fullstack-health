import React, { useState } from "react";
import { getNeutritionalInfo } from "../hooks/userHooks";
import { useNavigate } from "react-router-dom";

interface NutritionData {
  foodName: string;
  nutrients: Record<string, string>;
  servingSize: string;
}

const HomeScreen: React.FC = () => {
  const [food, setFood] = useState<string>('');
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const result = await getNeutritionalInfo(food);
      if ('error' in result) {
        if (result.status === 401) {
          // Handle 401 Unauthorized
          localStorage.removeItem('healthToken');
          navigate('/login');
          return;
        }
        setError(result.error);
        setNutritionData(null);
      } else {
        setNutritionData(result.data);
        setError(null);
      }
    } catch (err) {
      setError('Error fetching nutrition data');
      setNutritionData(null);
    }
  };

  return (
    <div className="nutrition-app">
      <header className="app-header">
        <h1>Nutrition Search</h1>
      </header>
      <main className="app-main">
        <div className="search-container">
          <input
            type="text"
            value={food}
            onChange={(e) => setFood(e.target.value)}
            placeholder="Enter food name"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {nutritionData && (
          <div className="nutrition-info">
            <h2>{nutritionData.foodName}</h2>
            <p className="serving-size">Serving Size: {nutritionData.servingSize}</p>
            <h3>Nutrients:</h3>
            <div className="nutrients-grid">
              {Object.entries(nutritionData.nutrients).map(([nutrient, value]) => (
                <div key={nutrient} className="nutrient-item">
                  <span className="nutrient-name">{nutrient}:</span>
                  <span className="nutrient-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};



export default HomeScreen;