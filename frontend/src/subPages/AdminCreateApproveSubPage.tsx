
import { useState, useEffect } from 'react';
import { getAllArticles } from "../hooks/articleHooks";
import { approveArticle } from '../hooks/adminHooks';

interface Article {
  _id: string;
  title: string;
  category: string;
  authorName: string;
  authorEmail: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
  status: string;
}

const AdminCreateApproveSubPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getAllArticles();
      setArticles(data.filter((article) => article.status !== 'approved'));
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleApprove = async (articleId: string) => {
    try {
      await approveArticle(articleId);
      fetchArticles();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="admin-articles-container">
      <h1>Unapproved Articles</h1>
      {articles.map((article) => (
        <div key={article._id} className="article-card">
          <h2 className="article-title">{article.title}</h2>
          <p className="article-category">Category: {article.category}</p>
          <p className="article-author">
            Author: {article.authorName} ({article.authorEmail})
          </p>
          <p className="article-date">
            Created At: {new Date(article.createdAt).toLocaleString()}
          </p>
          <p className="article-likes">
            Likes: {article.likesCount} | Dislikes: {article.dislikesCount}
          </p>
          <button 
            className="delete-button"
            onClick={() => handleApprove(article._id)}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminCreateApproveSubPage;