import { useState, useEffect } from 'react';

export const useToken = (): string | null => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      setToken(prevToken => (prevToken !== currentToken ? currentToken : prevToken));
    }, 1000); // перевіряємо кожну секунду

    return () => clearInterval(interval);
  }, []);

  return token;
};
