import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    return decodedToken;
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};

export const getEmailFromToken = (token: string): string | null => {
  const decoded = decodeToken(token);
  return decoded ? decoded.email : null;
};
