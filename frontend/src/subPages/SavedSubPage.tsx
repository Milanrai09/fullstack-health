import React, { useEffect, useState } from 'react';
import { getSavedArticle, likeArticle, dislikeArticle, saveArticle, ApiResponse } from '../hooks/articleHooks';

interface Article {
  _id: string;
  title: string;
  authorName: string;
  authorEmail: string;
  content: string;
  likesCount: number;
  dislikesCount: number;
  status: string;
  category: string;
}

const SavedSubPage: React.FC = () => {
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const healthToken = localStorage.getItem('healthToken');
  const parsedData = JSON.parse(healthToken ?? '');

    const authorId = parsedData.userId;

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const response = await getSavedArticle(authorId);
        console.log('API Response:', response); // Keep this log for debugging

        if (response.error) {
          setError(response.error);
        } else if (Array.isArray(response.data)) {
          console.log('Saved Articles:', response.data); // Add this line for debugging
          setSavedArticles(response.data);
        } else {
          setError('Unexpected data format received from the server');
        }
      } catch (error) {
        console.error('Error fetching saved articles:', error);
        setError('Failed to fetch saved articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSavedArticles();
  }, [authorId]);


  const handleLike = (articleId: string) => {
    likeArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article liked successfully:', response);
        setSavedArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId ? { ...article, likesCount: article.likesCount + 1 } : article
          )
        );
      })
      .catch((error: any) => {
        console.error('Error liking article:', error);
        setError('Failed to like article. Please try again later.');
      });
  };

  const handleDislike = (articleId: string) => {
    dislikeArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article disliked successfully:', response);
        setSavedArticles((prevArticles) =>
          prevArticles.map((article) =>
            article._id === articleId ? { ...article, dislikesCount: article.dislikesCount + 1 } : article
          )
        );
      })
      .catch((error: any) => {
        console.error('Error disliking article:', error);
        setError('Failed to dislike article. Please try again later.');
      });
  };

  const handleSave = (articleId: string) => {
    saveArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article saved successfully:', response);
        // You might want to update the UI to reflect that the article is saved
      })
      .catch((error: any) => {
        console.error('Error saving article:', error);
        setError('Failed to save article. Please try again later.');
      });
  };

  if (isLoading) {
    return <div>Loading saved articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="saved-articles">
      <h2>Saved Articles</h2>
      {savedArticles.length > 0 ? (
        savedArticles.map((article: Article) => (
          <div key={article._id} className="article-card">
            <div className="article-header">
              <h3>{article.title || 'Untitled'}</h3>
              <p className="author-info">
                By: {article.authorName || 'Unknown'} ({article.authorEmail || 'No email'})
              </p>
            </div>
            <p className="article-content">{article.content || 'No content available'}</p>
            <div className="article-footer">
              <p>Category: {article.category || 'Uncategorized'}</p>
              <p>Status: {article.status || 'Unknown'}</p>
            </div>
            <div className="article-actions">
              <button onClick={() => handleLike(article._id)}>
                Like ({article.likesCount || 0})
              </button>
              <button onClick={() => handleDislike(article._id)}>
                Dislike ({article.dislikesCount || 0})
              </button>
              <button onClick={() => handleSave(article._id)}>Save</button>
            </div>
          </div>
        ))
      ) : (
        <div>No saved articles found.</div>
      )}
    </div>
  );
};

export default SavedSubPage;