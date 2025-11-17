import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const excerpt = article.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col group">
      <Link to={`/post/${article.slug}`}>
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link to={`/category/${article.category}`} className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wide">
            {article.category}
          </Link>
          <h2 className="mt-2 text-xl font-bold leading-tight text-gray-900 dark:text-white">
            <Link to={`/post/${article.slug}`} className="group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
              {article.title}
            </Link>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
            {excerpt}
          </p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <User size={14} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <time dateTime={article.date}>
              {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;