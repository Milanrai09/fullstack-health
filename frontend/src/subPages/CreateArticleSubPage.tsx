import React,{useState} from 'react'
import {createArticle} from '../hooks/articleHooks';



const CreateArticleSubPage = () => {
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const healthToken = JSON.parse(localStorage.getItem('healthToken') || '{}');
  const userId = healthToken.userId;
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const article = { category, title, content,userId };
    try {
    await createArticle(article);
      setCategory('');
      setTitle('');
      setContent('');
      // Redirect or display success message
    } catch (error) {
      console.error(error);
      // Display error message
    }
  };

  return (<div className="create-article-container">
  <h1 className="create-article-title">Create Article</h1>
  <form onSubmit={handleSubmit} className="create-article-form">
    <div className="form-group">
      <label htmlFor="category" className="form-label">Category:</label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="form-select"
      >
        <option value="">Select a category</option>
        <option value="mental-health">Mental Health</option>
        <option value="diet">Diet</option>
        <option value="fitness">Fitness</option>
        <option value="health-lifestyle">Health Lifestyle</option>
        {/* Add more categories as needed */}
      </select>
    </div>
    <div className="form-group">
      <label htmlFor="title" className="form-label">Title/Headline:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="form-input"
      />
    </div>
    <div className="form-group">
    <label htmlFor="content" className="form-label">Article:</label>
      <textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        className="form-textarea"
        rows={3} 
      />
    </div>
    <button type="submit" className="submit-button">Create</button>
  </form>
</div>
  );
};
export default CreateArticleSubPage
