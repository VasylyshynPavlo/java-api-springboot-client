import './App.css';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/category/CategoriesPage';
import Layout from './components/Layout';
import ProductsPage from './pages/product/ProductsPage';
import CreateCategoryPage from './pages/category/CreateCategoryPage';
import EditCategoryPage from './pages/category/EditCategoryPage';
import CreateProductPage from './pages/product/CreateProductPage';
import EditProductPage from './pages/product/EditProductPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route index element={<HomePage />}/>
                    <Route path='categories'>
                        <Route index element={<CategoriesPage />}/>
                        <Route path='create' element={<CreateCategoryPage />}/>
                        <Route path='edit/:id' element={<EditCategoryPage />}/>
                    </Route>
                    <Route path='products'>
                        <Route index element={<ProductsPage />}/>
                        <Route path='create' element={<CreateProductPage />}/>
                        <Route path='edit/:id' element={<EditProductPage />}/>
    
                    </Route>
                    <Route path={"register"} element={<RegisterPage />} />
                    <Route path={"login"} element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
