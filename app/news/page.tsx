'use client';

import { useEffect, useState } from 'react';

interface Article {
  title: string;
  description: string;
  link: string; // 'url' 대신 'link' 필드를 사용합니다.
  // source: {
  //   name: string;
  // };
  source_name: string; // newsdata.io API는 source_name을 직접 제공합니다.
}

export default function NewsPage() {
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news'); // API 경로를 가정합니다.
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNews(data.results || []); // newsdata.io API 응답은 'results' 필드를 사용합니다.
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Latest Stock News</h1>
        <p>Loading stock news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Latest Stock News</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Latest Stock News</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.slice(0, 10).map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">
              <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {article.title}
              </a>
            </h2>
            <p className="text-gray-700 mb-2">{article.description}</p>
            <p className="text-gray-500 text-sm">Source: {article.source_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
