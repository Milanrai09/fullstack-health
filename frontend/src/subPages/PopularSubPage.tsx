import React, { useState, useEffect } from 'react';
import { getAllArticles, likeArticle, dislikeArticle, saveArticle } from '../hooks/articleHooks';
import { useLocation, useNavigate } from 'react-router-dom';

interface Article {
  _id: string;
  title: string;
  content: string;
  category: string;
  authorName: string;
  authorEmail: string;
  status: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  updatedAt: string;
}

const PopularDietArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const redirect = `${location.pathname}`;
  const healthToken = JSON.parse(localStorage.getItem('healthToken') || '{}');
  const userId = healthToken?.userId;

  useEffect(() => {
    setIsLoading(true);
    getAllArticles()
      .then((data: Article[]) => {
        const popularDietArticles = data
          .filter(article => 
            article.status === 'approved' && 
            article.likesCount > 0
          )
          .sort((a, b) => b.likesCount - a.likesCount);
        
        setArticles(popularDietArticles);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  const handleLike = async (articleId: string) => {
    try {
      await likeArticle(articleId, userId);
      setArticles(prevArticles => {
        const updatedArticles = prevArticles.map(article => 
          article._id === articleId 
            ? { ...article, likesCount: article.likesCount + 1 }
            : article
        );
        return updatedArticles.sort((a, b) => b.likesCount - a.likesCount);
      });
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };
  
  const handleDislike = async (articleId: string) => {
    try {
      await dislikeArticle(articleId, userId);
      setArticles(prevArticles => {
        const updatedArticles = prevArticles.map(article => 
          article._id === articleId 
            ? { ...article, dislikesCount: article.dislikesCount + 1 }
            : article
        );
        return updatedArticles.sort((a, b) => b.likesCount - a.likesCount);
      });
    } catch (error) {
      console.error('Error disliking article:', error);
    }
  };

  const handleSave = async (articleId: string) => {
    try {
      await saveArticle(articleId, userId);
      console.log('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  if (isLoading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="popular-articles">
      <h2>Popular Diet Articles</h2>
      {articles.length === 0 ? (
        <p>No popular diet articles found.</p>
      ) : (
        articles.map(article => (
          <div key={article._id} className="article-card">
            <div className="article-header">
              <h3 id="clickRoute" onClick={() => navigate(`${redirect}/${article._id}`)}>{article.title}</h3>
              <p className="author-info">
                By: {article.authorName} ({article.authorEmail})
              </p>
            </div>
            <p className="article-content">{article.content.substring(0, 150)}...</p>
            <div className="article-actions">
              <button onClick={() => handleLike(article._id)}>Like ({article.likesCount})</button>
              <button onClick={() => handleDislike(article._id)}>Dislike ({article.dislikesCount})</button>
              <button onClick={() => handleSave(article._id)}>Save</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PopularDietArticles;