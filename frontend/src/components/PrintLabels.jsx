import React, { useState } from 'react';
import POSLayout from '../layouts/POSLayout';
import { useGetPackingQuery } from '../features/inventory/packingSlice';
import { useGetProductsQuery } from '../features/inventory/productSlice';
import { useGetBrandsQuery } from '../features/inventory/brandSlice';


const PrintLabels = () => {
  const { data: packingList = [], isLoading } = useGetPackingQuery();
//   console.log('123'+JSON.stringify(packingList))
  const { data: products = [] } = useGetProductsQuery();

const { data: brands = [] } = useGetBrandsQuery();
// console.log('123'+JSON.stringify(products))


  const [selectedPacking, setSelectedPacking] = useState(null);
  const [previewText, setPreviewText] = useState('');
  const [loading, setLoading] = useState(false);
const getProductBrandName = (productID, brandID) => {
  const product = products.find(p => p.id === productID);
  const brand = brands.find(b => b.id === brandID);
  const productName = product?.name || 'UnknownProduct';
  const brandName = brand?.name || 'UnknownBrand';
  return `${brandName} ${productName}`;
};

 

  const handlePreviewLabel = async () => {
      if (!selectedPacking) return;

//   const name = getProductBrandName(selectedPacking.productID, selectedPacking.brandID);
   const name = products.find(p => p.id === selectedPacking.productID);
    let barcode = '';

try {
  const raw = selectedPacking.barcode; // This is a string like '["050680089025001"]'
  const parsed = JSON.parse(raw);      // Convert to array: ['050680089025001']
  barcode = parsed?.[0] || '';         // Take first element

//   console.log(selectedPacking.barcode)
//   console.log(parsed)
//   console.log(barcode)
} catch (e) {
  console.error("❌ Barcode parsing error:", e);
}

   
    try {
      const res = await fetch('http://localhost:5001/api/print/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
      name,
      quantity: selectedPacking.quantity,
      units: selectedPacking.packUnits,
      price: selectedPacking.discountedPrice,
      qty: selectedPacking.packcount,
      PkdDate: selectedPacking.pkddt,
      ExpDate: selectedPacking.expirydate,
      barcode: barcode,

    }),
      });

      const data = await res.json();
      setPreviewText(data.prn || '❌ Preview unavailable');
    } catch (err) {
      alert('❌ Error generating label preview: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

 const handlePrintLabel = async () => {
  if (!selectedPacking) return;

     const name = products.find(p => p.id === selectedPacking.productID);

     let barcode = '';

try {
  const raw = selectedPacking.barcode; // This is a string like '["050680089025001"]'
  const parsed = JSON.parse(raw);      // Convert to array: ['050680089025001']
  barcode = parsed?.[0] || '';         // Take first element
} catch (e) {
  console.error("❌ Barcode parsing error:", e);
}


  const res = await fetch('http://localhost:5001/api/print/print-label', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      quantity: selectedPacking.quantity,
      units: selectedPacking.packUnits,
      price: selectedPacking.discountedPrice,
      qty: selectedPacking.packcount,
      PkdDate: selectedPacking.pkddt,
      ExpDate: selectedPacking.expirydate,
      barcode: barcode,

    }),
  });

  const data = await res.json();
  alert(data.success ? '✅ Printed!' : `❌ Error: ${data.error}`);
};


  if (isLoading) return <div className="p-4">Loading packages...</div>;

  return (
    <POSLayout>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">📦 Packed Items</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {packingList.map((p) => (
            <div
              key={p.id}
              onClick={() => {
                setSelectedPacking(p);
                setPreviewText('');
              }}
              className={`border rounded p-3 shadow-sm cursor-pointer ${
                selectedPacking?.id === p.id ? 'bg-green-100' : 'hover:bg-gray-100'
              }`}
            >
              <p><strong>Product:</strong>{getProductBrandName(p.productID, p.brandID)}</p>
              <p><strong>Pack Count:</strong> {p.packcount}</p>
              <p><strong>Price:</strong> ₹{p.discountedPrice}</p>
            </div>
          ))}
        </div>

        {selectedPacking && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">🧾 Packing Label</h3>
            <p><strong>Product:</strong>  {getProductBrandName(selectedPacking.productID, selectedPacking.brandID)}</p>
            <p><strong>Quantity per Pack:</strong> {selectedPacking.quantity} {selectedPacking.packUnits || selectedPacking.unitName}</p>
            <p><strong>Discount Price:</strong> ₹{selectedPacking.discountedPrice}</p>
            <p><strong>Packs:</strong> {selectedPacking.packcount}</p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={handlePreviewLabel}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                disabled={loading}
              >
                 Preview Label
              </button>

              <button
                onClick={handlePrintLabel}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                disabled={loading}
              >
                Print Label
              </button>
            </div>

            {previewText && (
              <div className="mt-6">
                <h4 className="font-semibold mb-2">PRN Preview</h4>
                <textarea
                  className="w-full h-64 border p-2 font-mono text-sm bg-black text-green-400"
                  readOnly
                  value={previewText}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </POSLayout>
  );
};

export default PrintLabels;
