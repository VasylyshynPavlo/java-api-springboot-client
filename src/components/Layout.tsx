import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIcons, faBagShopping, faHome } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const routes = [
  { path: '/', label: 'Home', icon: faHome },
  { path: '/categories', label: 'Categories', icon: faIcons },
  { path: '/products', label: 'Products', icon: faBagShopping },
];

const Layout = () => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 relative">
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

      <footer className="bg-gray-800 text-white text-center p-4">&copy; 2025 My Store</footer>
    </div>
  );
};

export default Layout;
