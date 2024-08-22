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
      <div className="full-article">
          <h1 className="article-title">{article.title}</h1>
          <div className="article-metadata">
            <p className="author-info">By: {article.authorName} ({article.authorEmail})</p>
            <p className="category">Category: {location.pathname.split('/')[2]}</p>
          </div>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          <div className="article-actions">
            <button className="like-btn" onClick={() => handleLike(article._id)}>Like ({article.likesCount})</button>
            <button className="dislike-btn" onClick={() => handleDislike(article._id)}>Dislike ({article.dislikesCount})</button>
            <button className="save-btn" onClick={() => handleSave(article._id)}>Save</button>
          </div>
    </div>
  );
};

export default SingleArticleScreen;