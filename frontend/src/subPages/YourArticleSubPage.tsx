import React, { useState, useEffect } from 'react';
import { getAllArticles, editArticle, saveArticle } from '../hooks/articleHooks';

interface Article {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
}

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onSave: (article: Article) => void;
}> = ({ isOpen, onClose, article, onSave }) => {
  const [editedArticle, setEditedArticle] = useState<Article | null>(article);

  useEffect(() => {
    setEditedArticle(article);
  }, [article]);

  if (!isOpen || !editedArticle) return null;

  return (
    <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
      <div className="modal-content">
        <h2>Edit Article</h2>
        <input
          type="text"
          value={editedArticle.title}
          onChange={(e) => setEditedArticle({ ...editedArticle, title: e.target.value })}
        />
        <textarea
          value={editedArticle.content}
          onChange={(e) => setEditedArticle({ ...editedArticle, content: e.target.value })}
        />
        <button onClick={() => onSave(editedArticle)}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

const YourArticleSubPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const healthToken = localStorage.getItem('healthToken');
  const parsedData = healthToken ? JSON.parse(healthToken) : null;
  const userId = parsedData?.userId;

  useEffect(() => {
    if (userId) {
      getAllArticles()
        .then((data: Article[]) => {
          const filteredArticles = data.filter((article) => article.authorId === userId);
          setArticles(filteredArticles);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [userId]);

  const handleEdit = (article: Article) => {
    console.log('Edit button clicked', article);
    setEditingArticle(article);
    setIsModalOpen(true);
    console.log('isModalOpen set to true');
  };

  const handleSave = async (updatedArticle: Article) => {
    try {
      const savedArticle = await editArticle(
        updatedArticle._id,
        userId,
        updatedArticle.title,
        updatedArticle.content
      );
      setArticles(articles.map(article => 
        article._id === savedArticle._id ? savedArticle : article
      ));
      setIsModalOpen(false);
      setEditingArticle(null);
    } catch (error) {
      setError('Failed to save the article');
    }
  };

  const handleSaveArticle = async (article: Article) => {
    try {
      await saveArticle(article._id, userId);
      setArticles(articles.map(a => 
        a._id === article._id ? { ...a, saved: true } : a
      ));
    } catch (error) {
      setError('Failed to save the article');
    }
  };

  return (
    <div className="articles-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <h1>Your Articles</h1>
          {articles.length > 0 ? (
            articles.map((article) => (
              <div key={article._id} className="article-card">
                <h2>{article.title}</h2>
                <p>{article.content}</p>
                <p>Category: {article.category}</p>
                <div className="buttons">
                  <button onClick={() => handleEdit(article)}>Edit</button>
                  <button onClick={() => handleSaveArticle(article)}>Save</button>               
                </div>
              </div>
            ))
          ) : (
            <p>No articles found</p>
          )}
        </>
      )}

      <EditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        article={editingArticle}
        onSave={handleSave}
      />
    </div>
  );
};

export default YourArticleSubPage;