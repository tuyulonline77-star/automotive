
import React, { useState, useRef } from 'react';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import { Article } from '../types';
import ArticleForm from '../components/ArticleForm';
import { autoGenerateArticle } from '../services/geminiService';
import { Plus, Edit, Trash2, Download, Upload, Bot, LogOut, Globe, CheckCircle, XCircle } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { articles, addArticle, updateArticle, deleteArticle, setArticles } = useArticles();
  const { logout } = useAuth();
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveArticle = (article: Article) => {
    if (articles.some(a => a.id === article.id)) {
      updateArticle(article);
    } else {
      addArticle(article);
    }
    setEditingArticle(null);
  };
  
  const handleGenerateArticle = async () => {
    setIsGenerating(true);
    try {
      const generatedData = await autoGenerateArticle();
      const slug = generatedData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newArticle: Article = {
        id: crypto.randomUUID(),
        slug,
        author: 'AI Assistant',
        date: new Date().toISOString(),
        thumbnail: `https://picsum.photos/seed/${slug}/800/600`,
        published: false,
        category: 'EV',
        ...generatedData,
      };
      addArticle(newArticle);
    } catch (error) {
      alert(`Error generating article: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(articles, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'posts.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          if (typeof content === 'string') {
            const importedArticles: Article[] = JSON.parse(content);
            // Basic validation
            if (Array.isArray(importedArticles) && importedArticles.every(a => a.id && a.title)) {
              setArticles(importedArticles);
              alert('Articles imported successfully!');
            } else {
              throw new Error('Invalid file format.');
            }
          }
        } catch (error) {
          alert(`Error importing file: ${error instanceof Error ? error.message : 'Invalid JSON format.'}`);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const generateSitemap = () => {
    const urls = articles
      .filter(a => a.published)
      .map(a => `
  <url>
    <loc>${window.location.origin}/#/post/${a.slug}</loc>
    <lastmod>${new Date(a.date).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.origin}/#/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>${urls}
</urlset>`;
    
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const sortedArticles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <button onClick={() => setEditingArticle({})} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
          <Plus size={16} /> Create Article
        </button>
        <button onClick={handleGenerateArticle} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
          {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Bot size={16} />} 
          {isGenerating ? 'Generating...' : 'Auto-Generate Article'}
        </button>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          <Download size={16} /> Export posts.json
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
          <Upload size={16} /> Import posts.json
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
        <button onClick={generateSitemap} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700">
          <Globe size={16} /> Generate sitemap.xml
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3">Category</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Published</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedArticles.map(article => (
              <tr key={article.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{article.title}</td>
                <td className="px-6 py-4">{article.category}</td>
                <td className="px-6 py-4">{new Date(article.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  {article.published ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                </td>
                <td className="px-6 py-4 flex items-center gap-4">
                  <button onClick={() => setEditingArticle(article)} className="text-blue-500 hover:text-blue-700"><Edit size={18} /></button>
                  <button onClick={() => {if (window.confirm('Are you sure?')) deleteArticle(article.id)}} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {editingArticle && <ArticleForm article={editingArticle} onSave={handleSaveArticle} onClose={() => setEditingArticle(null)} />}
    </div>
  );
};

export default AdminPage;
