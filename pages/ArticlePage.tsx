
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import SeoUpdater from '../components/SeoUpdater';
import { Calendar, User, Tag } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug } = useArticles();

  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold">404 - Article Not Found</h1>
        <p className="mt-4 text-lg">The article you are looking for does not exist.</p>
        <Link to="/" className="mt-8 inline-block px-6 py-3 text-white bg-primary-600 rounded-lg hover:bg-primary-700">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <SeoUpdater article={article} />
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <img src={article.thumbnail} alt={article.title} className="w-full h-64 md:h-96 object-cover" />
        <div className="p-6 md:p-10">
          <header className="mb-8">
            <Link to={`/category/${article.category}`} className="text-sm font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider">
              {article.category}
            </Link>
            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {article.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
              </div>
            </div>
          </header>
          
          <div
            className="prose dark:prose-invert prose-lg max-w-none prose-h2:text-2xl prose-h2:font-bold prose-h3:text-xl prose-h3:font-semibold prose-a:text-primary-600 dark:prose-a:text-primary-400"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-gray-500 dark:text-gray-400" />
              <span className="font-semibold">Keywords:</span>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 text-xs text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
};

export default ArticlePage;
