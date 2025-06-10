import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Inventory from './pages/Inventory';
import Cashier from './pages/Cashier';
import POS from './pages/POS';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import CatalogForm from './componenets/CatalogForm';
import ProductForm from './componenets/ProductForm';

// import PrintInvoicePage from './componenets/PrintInvoicePage';




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes by Role */}
          {/* <Route path="/admin" element={ */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          } />

          {/* <Route path="/inventory" element={
            <ProtectedRoute role={["ADMIN","INVENTORY"]}>
              <Inventory />

            </ProtectedRoute>
            
          } /> */}
           
         <Route path="/inventory" element={
  <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
    <Inventory />
  </ProtectedRoute>
}>
  <Route path="catalog" element={
    <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
      <CatalogForm />
    </ProtectedRoute>
  } />
  <Route path="product" element={
    <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
      <ProductForm />
    </ProtectedRoute>
  } />
</Route>


          <Route path="/cashier" element={
            <ProtectedRoute role="CASHIER">
              <Cashier />
            </ProtectedRoute>
          } />

          <Route path="/pos" element={
            <ProtectedRoute role={["ADMIN", "CASHIER"]}>
              <POS />
            </ProtectedRoute>
          } />
          {/* 🖨️ Add this line */}
            {/* <Route path="/print-invoice" element={<PrintInvoicePage />} /> */}
          {/* 🔄 Fallback Route for unknown paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
