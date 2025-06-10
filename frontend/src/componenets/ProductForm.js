import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProducts,
  updateProduct,
  addProduct,
  fetchProductByCatalogId,
  clearProduct,
} from '../features/products/productSlice';
import { fetchCatalogs } from '../features/catalogs/catalogSlice';
// import { useAuth } from '../context/AuthContext';

function ProductForm() {
  const dispatch = useDispatch();
  // const { token } = useAuth();
  const token = useSelector((state) => state.posUser.userInfo?.token);
  const { all: products = [], selected } = useSelector((state) => state.products || {});
  const { all: catalogs = [] } = useSelector((state) => state.catalogs || {});

  const initialProductState = {
    catalogId: '',
    barcodeInput: '',
    barcodes: [],
    quantity: '',
    MRP: '',
    sellingPrice: '',
    discount: '',
    purchasePrice: '',
    warranty: '',
    importedYear: '',
    productDetails: '',
    couponCodes: '',
    promotionCodes: '',
    keywords: '',
  };

  const [newProduct, setNewProduct] = useState(initialProductState);
  const [catalogSuggestions, setCatalogSuggestions] = useState([]);
  const [isExisting, setIsExisting] = useState(false);
  const [existingProductId, setExistingProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchCatalogs({ token }));
    dispatch(fetchAllProducts(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (selected && selected.id) {
      setIsExisting(true);
      setExistingProductId(selected.id);
      setNewProduct({
        ...selected,
        barcodeInput: '',
        barcodes: Array.isArray(selected.barcodes) ? selected.barcodes : [],
        couponCodes: Array.isArray(selected.couponCodes) ? selected.couponCodes.join(', ') : '',
        promotionCodes: Array.isArray(selected.promotionCodes) ? selected.promotionCodes.join(', ') : '',
        keywords: Array.isArray(selected.keywords) ? selected.keywords.join(', ') : '',
        productDetails: selected.productName,
      });
    }
  }, [selected]);

  const handleProductNameInput = (e) => {
    const input = e.target.value.toLowerCase();
    const matches = catalogs
      .filter((c) => c?.productName?.toLowerCase().includes(input))
      .map((c) => `${c.id} - ${c.productName}`);
    setCatalogSuggestions(matches);
    setNewProduct((prev) => ({ ...prev, productDetails: e.target.value }));
  };

  const handleSuggestionClick = (suggestion) => {
    const [catalogId, productName] = suggestion.split(' - ');
    setCatalogSuggestions([]);
    setNewProduct((prev) => ({
      ...initialProductState,
      catalogId: catalogId.trim(),
      productDetails: productName.trim(),
    }));
    dispatch(fetchProductByCatalogId({ catalogId: catalogId.trim(), token }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedProduct = { ...newProduct, [name]: value };

    const MRP = parseFloat(name === 'MRP' ? value : updatedProduct.MRP);
    const discount = parseFloat(name === 'discount' ? value : updatedProduct.discount);
    const sellingPrice = parseFloat(name === 'sellingPrice' ? value : updatedProduct.sellingPrice);

    if ((name === 'sellingPrice' || name === 'MRP') && !isNaN(MRP) && !isNaN(sellingPrice)) {
      updatedProduct.discount = ((MRP - sellingPrice) / MRP * 100).toFixed(2);
    }

    if ((name === 'discount' || name === 'MRP') && !isNaN(MRP) && !isNaN(discount)) {
      updatedProduct.sellingPrice = (MRP - (MRP * discount) / 100).toFixed(2);
    }

    setNewProduct(updatedProduct);
  };

  const handleBarcodeChange = (e) => {
    setNewProduct((prev) => ({ ...prev, barcodeInput: e.target.value }));
  };

  const handleBarcodeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = newProduct.barcodeInput.trim();
      if (code && !newProduct.barcodes.includes(code)) {
        setNewProduct((prev) => ({
          ...prev,
          barcodes: [...prev.barcodes, code],
          barcodeInput: '',
        }));
      }
    }
  };

  const handleBarcodeDelete = (index) => {
    setNewProduct((prev) => ({
      ...prev,
      barcodes: prev.barcodes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...newProduct,
      barcodes: Array.isArray(newProduct.barcodes) ? newProduct.barcodes : [],
      couponCodes: newProduct.couponCodes.split(',').map((c) => c.trim()),
      promotionCodes: newProduct.promotionCodes.split(',').map((p) => p.trim()),
      keywords: newProduct.keywords.split(',').map((k) => k.trim()),
    };

    try {
      if (isExisting && existingProductId) {
        await dispatch(updateProduct({ id: existingProductId, data: payload, token })).unwrap();
        alert('✅ Product updated!');
      } else {
        await dispatch(addProduct({ payload, token })).unwrap();
        alert('✅ Product added!');
      }

      dispatch(fetchAllProducts(token));
      dispatch(clearProduct());
      setNewProduct({ ...initialProductState });
      setCatalogSuggestions([]);
      setIsExisting(false);
      setExistingProductId(null);
    } catch (err) {
      console.error('Submit failed:', err);
      alert('❌ Failed to submit');
    }
  };

  return (
    <form className="grid grid-cols-2 gap-4 border p-4 bg-white mb-6 rounded" onSubmit={handleSubmit}>
      <input name="catalogId" placeholder="Catalog ID" onChange={handleChange} value={newProduct.catalogId} className="border p-2" />
      <input name="barcodeInput" placeholder="Scan barcode" value={newProduct.barcodeInput} className="border p-2"
        onChange={handleBarcodeChange} onKeyDown={handleBarcodeKeyDown} />
      {newProduct.barcodes.length > 0 && (
        <div className="col-span-2 bg-gray-100 p-2 rounded">
          <strong>Scanned Barcodes:</strong>
          <ul className="list-disc list-inside text-sm mt-1">
            {newProduct.barcodes.map((b, i) => (
              <li key={i} className="flex justify-between items-center">
                <span>{b}</span>
                <button type="button" className="text-red-600" onClick={() => handleBarcodeDelete(i)}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <input name="purchasePrice" type="number" step="0.01" onChange={handleChange} placeholder="Purchase Price" className="border p-2" value={newProduct.purchasePrice} />
      <input name="MRP" type="number" step="0.01" onChange={handleChange} placeholder="MRP" className="border p-2" value={newProduct.MRP} />
      <input name="sellingPrice" type="number" step="0.01" onChange={handleChange} placeholder="Selling Price" className="border p-2" value={newProduct.sellingPrice} />
      <input name="discount" type="number" step="0.01" onChange={handleChange} placeholder="Discount (%)" className="border p-2" value={newProduct.discount} />
      <input name="quantity" type="number" onChange={handleChange} placeholder="Quantity" className="border p-2" value={newProduct.quantity} />
      <input name="warranty" onChange={handleChange} placeholder="Warranty" className="border p-2" value={newProduct.warranty} />
      <input name="importedYear" type="number" onChange={handleChange} placeholder="Imported Year" className="border p-2" value={newProduct.importedYear} />
      <div className="relative col-span-2">
        <input name="productDetails" placeholder="Search Product Name" className="border p-2 w-full" value={newProduct.productDetails} onChange={handleProductNameInput} autoComplete="off" />
        {catalogSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full shadow max-h-40 overflow-y-auto">
            {catalogSuggestions.map((s, i) => (
              <li key={i} onClick={() => handleSuggestionClick(s)} className="px-3 py-2 hover:bg-blue-100 cursor-pointer">{s}</li>
            ))}
          </ul>
        )}
      </div>
      <input name="couponCodes" onChange={handleChange} placeholder="Coupon Codes (comma-separated)" className="border p-2" value={newProduct.couponCodes} />
      <input name="promotionCodes" onChange={handleChange} placeholder="Promotion Codes (comma-separated)" className="border p-2" value={newProduct.promotionCodes} />
      <input name="keywords" onChange={handleChange} placeholder="Keywords (comma-separated)" className="border p-2" value={newProduct.keywords} />
      <div className="col-start-2 text-right">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isExisting ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
