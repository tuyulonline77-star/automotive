import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Article } from '../types';

interface ArticleContextType {
  articles: Article[];
  loading: boolean;
  getArticleBySlug: (slug: string) => Article | undefined;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeArticles = async () => {
      try {
        const storedArticles = localStorage.getItem('autopulse_posts');
        if (storedArticles) {
          setArticles(JSON.parse(storedArticles));
        } else {
          const response = await fetch('./data/posts.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const initialPosts = await response.json();
          setArticles(initialPosts as Article[]);
        }
      } catch (error) {
        console.error("Failed to load articles:", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    initializeArticles();
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('autopulse_posts', JSON.stringify(articles));
    }
  }, [articles, loading]);

  const getArticleBySlug = useCallback((slug: string) => {
    return articles.find(article => article.slug === slug);
  }, [articles]);

  const addArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
  };

  const updateArticle = (updatedArticle: Article) => {
    setArticles(prev => prev.map(article => (article.id === updatedArticle.id ? updatedArticle : article)));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(article => article.id !== id));
  };

  return (
    <ArticleContext.Provider value={{ articles, loading, getArticleBySlug, addArticle, updateArticle, deleteArticle, setArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticles = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticles must be used within an ArticleProvider');
  }
  return context;
};