import { useState, useEffect } from 'react';
import { deleteArticle, getAllArticles } from "../hooks/articleHooks";

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

const AdminArticlesSubPage = () => {
  const [articles, setArticles] = useState<{ [key: string]: Article }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const data = await getAllArticles();
      const articleObject: { [key: string]: Article } = {};
      data.forEach((article: Article) => {
        articleObject[article._id] = article;
      });
      setArticles(articleObject);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const approvedArticles = Object.values(articles).filter((article) => article.status === 'approved');

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle(id);
      setArticles((prevArticles) => {
        const updatedArticles = { ...prevArticles };
        delete updatedArticles[id];
        return updatedArticles;
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-articles-container">
      <h1>Approved Articles</h1>
      {approvedArticles.map((article) => (
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
            onClick={() => handleDelete(article._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminArticlesSubPage;