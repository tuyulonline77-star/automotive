import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import ArticleCard from '../components/ArticleCard';
import { Search, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { articles, loading } = useArticles();
  const { category } = useParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');

  const publishedArticles = useMemo(() => {
    return articles
      .filter(article => article.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return publishedArticles
      .filter(article => {
        if (category) {
          return article.category.toLowerCase() === category.toLowerCase();
        }
        return true;
      })
      .filter(article => {
        const query = searchQuery.toLowerCase();
        if (!query) return true;
        return (
          article.title.toLowerCase().includes(query) ||
          article.keywords.some(k => k.toLowerCase().includes(query))
        );
      });
  }, [publishedArticles, category, searchQuery]);

  const featuredArticle = useMemo(() => {
    return !category && !searchQuery && filteredArticles.length > 0 ? filteredArticles[0] : null;
  }, [category, searchQuery, filteredArticles]);
  
  const otherArticles = useMemo(() => {
      return featuredArticle ? filteredArticles.slice(1) : filteredArticles;
  }, [featuredArticle, filteredArticles]);


  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
    );
  }

  return (
    <div className="space-y-12">
      {featuredArticle && (
         <div className="rounded-xl overflow-hidden relative aspect-video max-h-[500px] w-full group">
            <img src={featuredArticle.thumbnail} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"/>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                <Link to={`/category/${featuredArticle.category}`} className="text-sm font-semibold bg-primary-500/80 text-white px-3 py-1 rounded-full uppercase tracking-wide">
                    {featuredArticle.category}
                </Link>
                <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                    <Link to={`/post/${featuredArticle.slug}`}>
                        {featuredArticle.title}
                    </Link>
                </h1>
                <Link to={`/post/${featuredArticle.slug}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-lg group/link">
                    Read More
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover/link:translate-x-1"/>
                </Link>
            </div>
         </div>
      )}

      <div className="mb-8">
        {!featuredArticle && (
            <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
                 <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                    {category ? `Category: ${category}` : 'The Pulse of the Road'}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {category ? `Posts filed under the ${category} category.` : 'Your source for all things automotive.'}
                </p>
            </div>
        )}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search articles by title or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={22} />
          </div>
        </div>
      </div>

      {otherArticles.length > 0 ? (
        <div>
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-primary-500 pl-4">
              {category ? 'All Articles' : 'More Stories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherArticles.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
            </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Articles Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;