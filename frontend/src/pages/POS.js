import HeaderPOS from '../componenets/HeaderPOS';
import Footer from '../componenets/Footer';
import BillingSection from '../componenets/BillingSection';
import ProductList from '../componenets/ProductList';

function POS() {
  return (
    <div className="flex flex-col h-screen">
      <HeaderPOS />

      <main className="flex flex-1 overflow-hidden">
        {/* Billing Left */}
        <div className="w-1/2 border-r overflow-y-auto">
          <BillingSection />
        </div>

        {/* Product List Right */}
        <div className="w-1/2 overflow-y-auto bg-gray-50">
          <ProductList />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default POS;
