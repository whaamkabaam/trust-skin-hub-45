import { useEffect } from 'react';
import { useUnifiedBoxData } from '@/hooks/useUnifiedBoxData';
import { SEOCanonical } from './SEOCanonical';

// Generate XML sitemap for SEO
const generateSitemap = (boxes: any[]) => {
  const baseUrl = 'https://unpacked.gg';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticUrls = [
    { url: '/hub', priority: '0.9', changefreq: 'daily' },
    { url: '/hub/rillabox', priority: '0.8', changefreq: 'weekly' },
    { url: '/hub/hypedrop', priority: '0.8', changefreq: 'weekly' },
    { url: '/hub/casesgg', priority: '0.8', changefreq: 'weekly' },
    { url: '/hub/luxdrop', priority: '0.8', changefreq: 'weekly' }
  ];

  const boxUrls = boxes.map(box => {
    const slug = box.box_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return {
      url: `/hub/box/${slug}`,
      priority: '0.7',
      changefreq: 'weekly'
    };
  });

  const allUrls = [...staticUrls, ...boxUrls];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, priority, changefreq }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const SEOSitemap = () => {
  const { boxesData } = useUnifiedBoxData();

  useEffect(() => {
    if (boxesData.length > 0 && typeof window !== 'undefined') {
      const sitemap = generateSitemap(boxesData);
      
      // Store sitemap in localStorage for potential use
      localStorage.setItem('sitemap', sitemap);
      
      console.log('SEO Sitemap generated with', boxesData.length, 'mystery boxes');
    }
  }, [boxesData]);

  return (
    <>
      <SEOCanonical />
      {/* This component generates sitemap data but doesn't render UI */}
    </>
  );
};

export default SEOSitemap;