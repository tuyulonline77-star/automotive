
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { X } from 'lucide-react';

interface ArticleFormProps {
  article: Partial<Article> | null;
  onSave: (article: Article) => void;
  onClose: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Article>>({});

  useEffect(() => {
    setFormData(article || {});
  }, [article]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, keywords: e.target.value.split(',').map(k => k.trim()) }));
  }
  
  const handlePublishedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, published: e.target.checked }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Title and Content are required.');
      return;
    }
    
    const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const finalArticle: Article = {
      id: formData.id || crypto.randomUUID(),
      title: formData.title,
      slug: formData.slug || slug,
      meta_description: formData.meta_description || '',
      keywords: formData.keywords || [],
      category: formData.category || 'News',
      author: formData.author || 'Admin',
      date: formData.date || new Date().toISOString(),
      thumbnail: formData.thumbnail || `https://picsum.photos/seed/${slug}/800/600`,
      content: formData.content,
      published: formData.published === undefined ? true : formData.published,
    };
    onSave(finalArticle);
  };
  
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl my-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          <X size={24} />
        </button>
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">{formData.id ? 'Edit Article' : 'Create Article'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium">Content (HTML)</label>
                <textarea name="content" id="content" value={formData.content || ''} onChange={handleChange} rows={12} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600" required></textarea>
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="author" className="block text-sm font-medium">Author</label>
                  <input type="text" name="author" id="author" value={formData.author || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium">Category</label>
                    <select name="category" id="category" value={formData.category || 'News'} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                        <option>News</option>
                        <option>EV</option>
                        <option>Review</option>
                        <option>Modifikasi</option>
                        <option>Motorsport</option>
                    </select>
                </div>
              </div>
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium">Meta Description</label>
                <textarea name="meta_description" id="meta_description" value={formData.meta_description || ''} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"></textarea>
              </div>
              <div>
                <label htmlFor="keywords" className="block text-sm font-medium">Keywords (comma-separated)</label>
                <input type="text" name="keywords" id="keywords" value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : ''} onChange={handleKeywordsChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600" />
              </div>
              <div className="flex items-center">
                  <input type="checkbox" name="published" id="published" checked={formData.published || false} onChange={handlePublishedChange} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <label htmlFor="published" className="ml-2 block text-sm font-medium">Published</label>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700">Save Article</button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleForm;
