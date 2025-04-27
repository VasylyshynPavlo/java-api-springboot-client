import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons, faBagShopping, faHome } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { decodeToken, getEmailFromToken } from '../utils/decodeToken';
import { APP_ENV } from "../env";

const fetchUserData = async (email: string) => {
  try {
    const response = await fetch(APP_ENV.REMOTE_BASE_API + `auth/user?username=${email}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const routes = [
  { path: '/', label: 'Home', icon: faHome },
  { path: '/categories', label: 'Categories', icon: faIcons },
  { path: '/products', label: 'Products', icon: faBagShopping },
];

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number, username: string; avatar: string } | null>(null);

  const token = localStorage.getItem('token');
  const email = token ? getEmailFromToken(token) : null;

  useEffect(() => {
    const loadUserData = async () => {
      if (email) {
        const userData = await fetchUserData(email);
        if (userData) {
          setUser(userData);
        }
      }
    };
    loadUserData();
  }, [email]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 relative justify-between flex items-center">
        <ul className="flex space-x-4 relative">
          {routes.map(({ path, label, icon }) => (
            <li
              key={path}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredItem(path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link to={path} className="hover:no-underline flex items-center p-2 relative">
                {location.pathname === path && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 bg-blue-700 rounded-md"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <FontAwesomeIcon
                  icon={icon}
                  size="1x"
                  color="white"
                  className="relative z-10 ml-2 mr-2"
                />
                <motion.span
                  className="text-white overflow-hidden relative z-10 font-oswald"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredItem === path ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {label}
                </motion.span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="space-x-4 flex items-center">
          {email ? (
            <>
              <a className='flex gap-2 items-center hover:bg-blue-700 rounded-md px-3'>
                <img
                  src={APP_ENV.REMOTE_IMAGES_URL + 'medium/' + user?.avatar}
                  className="w-10 h-10 object-cover rounded"
                />
                <span className="font-oswald">{email}</span>
              </a>
              <button
                onClick={handleSignOut}
                className="bg-blue-700 hover:bg-red-700 px-3 py-1 rounded-md"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:underline">
                Sign up
              </Link>
              <Link
                to="/login"
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </nav>

      <main className="flex-1 p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">© 2025 My Store</footer>
    </div>
  );
};

export default Layout;
