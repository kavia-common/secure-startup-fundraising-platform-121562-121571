export const getURL = () => {
  let url = process.env.REACT_APP_SITE_URL;

  if (!url && typeof window !== 'undefined') {
    url = window.location.origin;
  }

  if (!url) {
    url = 'http://localhost:3000/';
  }

  url = url.startsWith('http') ? url : `https://${url}`;
  url = url.endsWith('/') ? url : `${url}/`;
  return url;
};
