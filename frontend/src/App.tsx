import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import NavigationBar from './components/Layout/Navbar';
import PageContainer from './components/Layout/PageContainer';
import ProductList from './components/Product/ProductList';
import ProductForm from './components/Product/ProductForm';
import RawMaterialList from './components/RawMaterial/RawMaterialList';
import RawMaterialForm from './components/RawMaterial/RawMaterialForm';
import ProductionSuggestions from './components/Production/ProductionSuggestions';

function App() {
  
  return (

    <BrowserRouter>
      
      <NavigationBar />
      <PageContainer>
      
        <Routes>

          <Route path='/' element={<Navigate to='products' /> } /> {/* redirects root route to products */}

          <Route path='/products' element={<ProductList /> } /> { /* main routes */}
          <Route path='/products/new' element={<ProductForm /> } />
          <Route path='/products/edit/:id' element={<ProductForm /> } />
          
          <Route path='/raw-materials' element={<RawMaterialList /> } />
          <Route path='/raw-materials/new' element={<RawMaterialForm /> } />
          <Route path='/raw-materials/edit/:id' element={<RawMaterialForm /> } />

          <Route path='/production' element={<ProductionSuggestions /> } />

        </Routes>
        
      </PageContainer>
    </BrowserRouter>
  );
}

export default App;
