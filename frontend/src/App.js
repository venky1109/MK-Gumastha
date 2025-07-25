import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Inventory from './pages/Inventory';
import Cashier from './pages/Cashier';
import POS from './pages/POS';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Business Pages
import PurchasePage from './pages/business/PurchasePage';
import ExpensePage from './pages/business/ExpensePage';
import PackingPage from './pages/business/PackingPage';
import ProductToBusiness from './pages/business/ProductToBusiness';

// Catalog Pages
import CatalogForm from './components/CategoryForm';
import ProductForm from './components/ProductForm';
import CategoryForm from './components/CategoryForm';
import BrandForm from './components/BrandForm';
import OutletForm from './components/OutletForm';
import UnitsForm from './components/UnitsForm';
import PrintLabels from './components/PrintLabels';

// Order Lifecycle Pages
import PackingOrdersPage from './pages/PackingOrdersPage';
import DispatchOrdersPage from './pages/DispatchOrdersPage';
import DeliveryPage from './pages/DeliveryPage';
// import PrintInvoicePage from './componenets/PrintInvoicePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          } />

          {/* Inventory Nested Routes */}
          <Route path="/inventory" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <Inventory />
            </ProtectedRoute>
          }>
            <Route path="catalog" element={<CatalogForm />} />
            {/* <Route path="product" element={<ProductForm />} /> */}
          </Route>

          {/* Catalog Management */}
          <Route path="/catalog/product" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <ProductForm />
            </ProtectedRoute>
          } />
          <Route path="/catalog/category" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <CategoryForm />
            </ProtectedRoute>
          } />
          <Route path="/catalog/brand" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <BrandForm />
            </ProtectedRoute>
          } />
          <Route path="/catalog/outlet" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <OutletForm />
            </ProtectedRoute>
          } />
          <Route path="/catalog/units" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <UnitsForm />
            </ProtectedRoute>
          } />

          {/* Business Routes */}
          <Route path="/business/purchase" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <PurchasePage />
            </ProtectedRoute>
          } />
          <Route path="/business/expense" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <ExpensePage />
            </ProtectedRoute>
          } />
          <Route path="/business/packing" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <PackingPage />
            </ProtectedRoute>
          } />
          <Route path="/business/add-product" element={
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <ProductToBusiness />
            </ProtectedRoute>
          } />
      
          {/* Cashier */}
          <Route path="/cashier" element={
            <ProtectedRoute role={["CASHIER", "ONLINE_CASHIER", "HYBRID_CASHIER"]}>
              <Cashier />
            </ProtectedRoute>
          } />

          {/* POS */}
          <Route path="/pos" element={
            <ProtectedRoute role={["ADMIN", "ONLINE_CASHIER", "CASHIER", "HYBRID_CASHIER"]}>
              <POS />
            </ProtectedRoute>
          } />
              <Route path="/business/print-labels" element={  // ✅ NEW
            <ProtectedRoute role={["ADMIN", "INVENTORY"]}>
              <PrintLabels />
            </ProtectedRoute>
          } />

          {/* Order Lifecycle Pages */}
          <Route path="/packing" element={
            <ProtectedRoute role="PACKING_AGENT">
              <PackingOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/dispatch" element={
            <ProtectedRoute role="DISPATCH_AGENT">
              <DispatchOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/delivery" element={
            <ProtectedRoute role="DELIVERY_AGENT">
              <DeliveryPage />
            </ProtectedRoute>
          } />

          {/* Future printing feature */}
          {/* <Route path="/print-invoice" element={<PrintInvoicePage />} /> */}

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
