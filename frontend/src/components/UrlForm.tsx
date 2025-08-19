import { useState } from 'react';
import { UrlService } from '../api/urlService';

const UrlForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await UrlService.createUrl(url);
      setShortUrl(response.data);
    } catch (err: any) {
      console.error('Error creating short URL:', err.response?.data || err.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default UrlForm;
