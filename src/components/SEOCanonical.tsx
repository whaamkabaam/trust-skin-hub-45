import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOCanonicalProps {
  title?: string;
  description?: string;
}

export const SEOCanonical = ({ title, description }: SEOCanonicalProps) => {
  const location = useLocation();
  const canonicalUrl = `https://unpacked.gg${location.pathname}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
    </Helmet>
  );
};

export default SEOCanonical;