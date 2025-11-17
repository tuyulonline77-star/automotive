
import React, { useEffect } from 'react';
import { Article } from '../types';

interface SeoUpdaterProps {
  article: Article;
}

const SeoUpdater: React.FC<SeoUpdaterProps> = ({ article }) => {
  useEffect(() => {
    // Update title
    document.title = `${article.title} | AutoPulse News`;

    // Helper to create or update meta tags
    const setMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };
    
    // Helper to create or update property meta tags (for Open Graph)
    const setProperty = (property: string, content: string) => {
        let element = document.querySelector(`meta[property='${property}']`) as HTMLMetaElement;
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // Update meta description
    setMeta('description', article.meta_description);
    setMeta('keywords', article.keywords.join(', '));
    setMeta('author', article.author);

    // Update Open Graph tags
    const canonicalUrl = `${window.location.origin}/#/post/${article.slug}`;
    setProperty('og:title', article.title);
    setProperty('og:description', article.meta_description);
    setProperty('og:type', 'article');
    setProperty('og:url', canonicalUrl);
    setProperty('og:image', article.thumbnail);
    setProperty('og:site_name', 'AutoPulse News');
    
    // Update or create canonical link
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);
    
    // Update or create JSON-LD script
    let jsonLdScript = document.getElementById('json-ld-article') as HTMLScriptElement;
    if(!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld-article';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.innerHTML = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': canonicalUrl,
        },
        'headline': article.title,
        'image': article.thumbnail,
        'datePublished': article.date,
        'author': {
            '@type': 'Person',
            'name': article.author,
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'AutoPulse News',
            'logo': {
                '@type': 'ImageObject',
                'url': `${window.location.origin}/assets/favicon.ico`,
            }
        },
        'description': article.meta_description,
    });


    // Cleanup on component unmount
    return () => {
      document.title = 'AutoPulse News';
      setMeta('description', 'The latest in automotive news, reviews, and culture.');
      if(jsonLdScript) document.head.removeChild(jsonLdScript);
    };
  }, [article]);

  return null;
};

export default SeoUpdater;
