import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * TrailingSlashRedirect
 * Ensures all internal navigation enforces trailing slash URLs.
 * If a visitor or external backlink lands on /path without trailing slash,
 * this component automatically normalizes the URL to /path/ using history replace.
 */
export const TrailingSlashRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;

    // Skip root URL
    if (pathname === '/') return;

    // If pathname does not end with a slash
    if (!pathname.endsWith('/')) {
      // Do not append slash if the URL points to a file with an extension
      const lastSegment = pathname.split('/').pop() || '';
      if (!lastSegment.includes('.')) {
        navigate(`${pathname}/${search}${hash}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

export default TrailingSlashRedirect;
