import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { getAllArticles, likeArticle, dislikeArticle, saveArticle } from '../hooks/articleHooks';

interface Article {
  _id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
}

const SingleArticleScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = 'your-user-id'; 

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      try {
        const allArticles = await getAllArticles();
        const matchedArticle = allArticles.find((article: Article) => article._id === id);
        if (matchedArticle) {
          setArticle(matchedArticle);
        } else {
          setError('Article not found');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch the article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleLike = async (articleId: string) => {
    try {
      await likeArticle(articleId, userId);
      // Removed setArticles, as it's not defined
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleDislike = async (articleId: string) => {
    try {
      await dislikeArticle(articleId, userId);
      // Removed setArticles, as it's not defined
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

  if (isLoading) return <div>Loading article...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="single-article-screen">
      <div className="container">
        {isLoading ? (
          <div className="loading-skeleton">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-meta"></div>
            <div className="skeleton skeleton-content"></div>
            <div className="skeleton skeleton-action"></div>
          </div>
        ) : error ? (
          <div className="error-container">
            <h1 className="error-title">Error</h1>
            <p className="error-message">{error}</p>
          </div>
        ) : !article ? (
          <div className="not-found-container">
            <h1 className="not-found-title">Article not found</h1>
            <p className="not-found-message">The article you're looking for doesn't exist or has been removed.</p>
          </div>
        ) : (
          <article className="article-card">
            <header className="article-header">
              <h1 className="article-title">{article.title}</h1>
              <div className="article-meta">
                <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${article.authorName}`} alt={article.authorName} className="author-avatar" />
                <div className="author-info">
                  <p className="author-name">{article.authorName}</p>
                  <p className="author-email">{article.authorEmail}</p>
                </div>
              </div>
              <div className="article-details">
                <span>Published on {new Date(article.publishedDate).toLocaleDateString()}</span>
                <span>{article.category}</span>
              </div>
            </header>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
            <footer className="article-footer">
              <button className="action-button" onClick={() => handleLike(article._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Like ({article.likesCount})
              </button>
              <button className="action-button" onClick={() => handleDislike(article._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                Dislike ({article.dislikesCount})
              </button>
              <button className="action-button" onClick={() => handleSave(article._id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                Save
              </button>
            </footer>
          </article>
        )}
      </div>
    </div>
  );
};

export default SingleArticleScreen;
