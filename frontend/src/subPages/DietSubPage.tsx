import { useState, useEffect } from 'react';
import { 
  getAllArticles, 
  likeArticle, 
  dislikeArticle, 
  saveArticle, 
  ApiResponse 
} from '../hooks/articleHooks';
import { useLocation, useNavigate } from 'react-router-dom';

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

const DietArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = `${location.pathname}`;
  const healthToken = JSON.parse(localStorage.getItem('healthToken') || '{}');
  const authorId = healthToken.userId;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getAllArticles();
        console.log('All articles:', response);

        const dietArticles = response.filter((article: Article) => 
          article.status === 'approved' && article.category.toLowerCase() === 'diet'
        );

        
        console.log('Diet articles:', dietArticles);

        const sortedArticles = dietArticles.sort((a: Article, b: Article) => b.likesCount - a.likesCount);
        console.log('Sorted diet articles:', sortedArticles);

        setArticles([...sortedArticles]);
        console.log('Articles state after setting:', articles);
      } catch (error: any) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleLike = (articleId: string) => {
    likeArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article liked successfully:', response);
        setArticles((prevArticles: Article[]) =>
          prevArticles.map((article: Article) =>
            article._id === articleId ? { ...article, likesCount: article.likesCount + 1 } : article
          )
        );
      })
      .catch((error: any) => {
        console.error('Error liking article:', error);
      });
  };

  const handleDislike = (articleId: string) => {
    dislikeArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article disliked successfully:', response);
        setArticles((prevArticles: Article[]) =>
          prevArticles.map((article: Article) =>
            article._id === articleId ? { ...article, dislikesCount: article.dislikesCount + 1 } : article
          )
        );
      })
      .catch((error: any) => {
        console.error('Error disliking article:', error);
      });
  };

  const handleSave = (articleId: string) => {
    saveArticle(articleId, authorId)
      .then((response: ApiResponse<any>) => {
        console.log('Article saved successfully:', response);
      })
      .catch((error: any) => {
        console.error('Error saving article:', error);
      });
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
        <p>No diet articles found.</p>
      ) : (
        articles.map((article: Article) => (
          <div key={article._id} className="article-card">
            <div className="article-header">
              <h3 onClick={() => navigate(`${redirect}/${article._id}`)}>{article.title}</h3>
              <p className="author-info">
                By: {article.authorName} ({article.authorEmail})
              </p>
            </div>
            <p className="article-content">
              {article.content}
            </p>
            <div className="article-actions">
              <button onClick={() => handleLike(article._id)}>
                Like ({article.likesCount})
              </button>
              <button onClick={() => handleDislike(article._id)}>
                Dislike ({article.dislikesCount})
              </button>
              <button onClick={() => handleSave(article._id)}>Save</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DietArticles;