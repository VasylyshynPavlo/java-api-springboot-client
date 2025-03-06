import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/category/CategoriesPage';
import Layout from './components/Layout';
import ProductPage from './pages/product/ProductsPage';
import CreateCategoryPage from './pages/category/CreateCategoryPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<HomePage />}/>
                    <Route path='categories'>
                        <Route index element={<CategoriesPage />}/>
                        <Route path='create' element={<CreateCategoryPage />}/>
                    </Route>
                    <Route path='products'>
                        <Route index element={<ProductPage />}/>
                        
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
