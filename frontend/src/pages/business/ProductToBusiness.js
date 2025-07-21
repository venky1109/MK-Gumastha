import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchProductByCatalogId,
} from '../../features/products/productSlice';

const ProductToBusiness = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.posUser.userInfo?.token);
  const { all: rawProducts = [] } = useSelector((state) => state.products);
  const products = Array.isArray(rawProducts) ? rawProducts : rawProducts.products || [];

  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selectedCatalog, setSelectedCatalog] = useState(null);

  const [editingBrand, setEditingBrand] = useState(null);
  const [editingFinancial, setEditingFinancial] = useState(null);
  const [newFinancialDetailId, setNewFinancialDetailId] = useState(null);

  useEffect(() => {
    if (token) dispatch(fetchAllProducts(token));
  }, [dispatch, token]);

  useEffect(() => {
    const lower = search.toLowerCase();
    if (lower === '') return setFiltered([]);
    const matches = products.filter((p) => p.name.toLowerCase().includes(lower));
    setFiltered(matches);
  }, [search, products]);

  const handleAddProductFromCatalog = async () => {
    const res = await dispatch(fetchProductByCatalogId({ catalogId: selectedCatalog._id, token }));
    const catalog = res.payload;
    const newProduct = {
      name: catalog.name,
      category: catalog.category,
      details: catalog.details.map((d) => ({
        brand: d.brand,
        description: d.description,
        images: d.images,
        financials: [],
      })),
    };
    dispatch(addProduct({ payload: newProduct, token }));
    alert('Product added. Now add financials.');
    setSearch('');
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct({ id: productId, token }));
    }
  };

  const handleDeleteBrand = (product, detailId) => {
    const updated = {
      ...product,
      details: product.details.filter((d) => d._id !== detailId),
    };
    dispatch(updateProduct({ id: product._id, data: updated, token }));
  };

  const handleDeleteFinancial = (product, detailId, financialId) => {
    const updated = {
      ...product,
      details: product.details.map((d) =>
        d._id === detailId
          ? {
              ...d,
              financials: d.financials.filter((f) => f._id !== financialId),
            }
          : d
      ),
    };
    dispatch(updateProduct({ id: product._id, data: updated, token }));
  };

  const handleSaveBrand = (product, detailId, updatedBrand) => {
    const updated = {
      ...product,
      details: product.details.map((d) =>
        d._id === detailId ? { ...d, ...updatedBrand } : d
      ),
    };
    dispatch(updateProduct({ id: product._id, data: updated, token }));
    setEditingBrand(null);
  };

  const handleSaveFinancial = (product, detailId, financialId, newData) => {
    const updated = {
      ...product,
      details: product.details.map((d) =>
        d._id === detailId
          ? {
              ...d,
              financials: financialId
                ? d.financials.map((f) => (f._id === financialId ? newData : f))
                : [...d.financials, newData],
            }
          : d
      ),
    };
    dispatch(updateProduct({ id: product._id, data: updated, token }));
    setEditingFinancial(null);
    setNewFinancialDetailId(null);
  };

  const handleAddBrandFromCatalog = (product) => {
    if (!selectedCatalog || !selectedCatalog.details) return;
    const existingBrands = product.details.map((d) => d.brand);
    const catalogBrands = selectedCatalog.details;

    const newBrands = catalogBrands.filter((d) => !existingBrands.includes(d.brand));

    if (newBrands.length === 0) {
      alert('No new brands available in catalog.');
      return;
    }

    const newBrand = newBrands[0];
    const updated = {
      ...product,
      details: [
        ...product.details,
        {
          brand: newBrand.brand,
          description: newBrand.description,
          images: newBrand.images || [],
          financials: [],
        },
      ],
    };
    dispatch(updateProduct({ id: product._id, data: updated, token }));
  };

  return (
    <div className="p-6 space-y-6">
      <input
        type="text"
        value={search}
        onChange={async (e) => {
          const value = e.target.value;
          setSearch(value);
          const match = products.find((p) => p.name.toLowerCase() === value.toLowerCase());
          if (!match && value.length > 2) {
            const res = await dispatch(fetchProductByCatalogId({ catalogId: value, token }));
            setSelectedCatalog(res.payload || null);
          }
        }}
        className="w-full p-2 border"
        placeholder="Search product name"
      />

      {filtered.length === 0 && search.length > 2 && selectedCatalog && (
        <div className="bg-gray-100 p-4 rounded">
          <p>Product not found. You can add from catalog:</p>
          <button
            onClick={handleAddProductFromCatalog}
            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
          >
            ➕ Add Product from Catalog
          </button>
        </div>
      )}

      {filtered.map((product) => (
        <div key={product._id} className="bg-white p-4 shadow rounded">
          <div className="flex justify-between">
            <div>
              <h3 className="text-xl font-bold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
            <button
              onClick={() => handleDeleteProduct(product._id)}
              className="text-red-500 text-sm"
            >
              🗑 Delete Product
            </button>
          </div>

          {product.details.map((detail) => (
            <div key={detail._id} className="border-t pt-2 mt-3">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Brand: {detail.brand}</h4>
                <div className="space-x-2">
                  <button
                    onClick={() => setEditingBrand({ product, detail })}
                    className="text-blue-500 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(product, detail._id)}
                    className="text-red-500 text-sm"
                  >
                    🗑
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">{detail.description}</p>
              <ul className="list-disc pl-6 text-sm mt-2">
                {detail.financials.map((fin) => (
                  <li key={fin._id}>
                    ₹{fin.dprice} ({fin.quantity} {fin.units}) - Stock: {fin.countInStock}
                    <button
                      onClick={() =>
                        setEditingFinancial({
                          product,
                          detailId: detail._id,
                          financialId: fin._id,
                          data: fin,
                        })
                      }
                      className="text-blue-500 ml-2 text-xs"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteFinancial(product, detail._id, fin._id)}
                      className="text-red-500 ml-1 text-xs"
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setNewFinancialDetailId(detail._id)}
                className="text-green-600 text-xs mt-1"
              >
                ➕ Add Financial
              </button>
            </div>
          ))}

          {selectedCatalog && (
            <button
              onClick={() => handleAddBrandFromCatalog(product)}
              className="text-indigo-600 text-sm mt-2"
            >
              ➕ Add Brand from Catalog
            </button>
          )}
        </div>
      ))}

      {/* Brand Edit Modal */}
      {editingBrand && (
        <div className="fixed top-10 left-1/3 bg-white border p-4 shadow-lg">
          <h3>Edit Brand</h3>
          <input
            className="w-full border p-2 my-2"
            value={editingBrand.detail.brand}
            onChange={(e) =>
              setEditingBrand({
                ...editingBrand,
                detail: { ...editingBrand.detail, brand: e.target.value },
              })
            }
          />
          <textarea
            className="w-full border p-2"
            value={editingBrand.detail.description}
            onChange={(e) =>
              setEditingBrand({
                ...editingBrand,
                detail: { ...editingBrand.detail, description: e.target.value },
              })
            }
          />
          <div className="flex gap-2 mt-2">
            <button
              className="bg-blue-500 text-white px-4 py-1"
              onClick={() =>
                handleSaveBrand(
                  editingBrand.product,
                  editingBrand.detail._id,
                  editingBrand.detail
                )
              }
            >
              Save
            </button>
            <button className="text-gray-600" onClick={() => setEditingBrand(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Financial Modal */}
      {(editingFinancial || newFinancialDetailId) && (
        <div className="fixed top-16 left-1/3 bg-white border p-4 shadow-xl w-96">
          <h3 className="text-md font-semibold mb-2">
            {editingFinancial ? 'Edit Financial' : 'Add Financial'}
          </h3>
          {[
            { label: 'Price', field: 'price' },
            { label: 'Discounted Price (dprice)', field: 'dprice' },
            { label: 'Discount %', field: 'Discount' },
            { label: 'Quantity', field: 'quantity' },
            { label: 'Count in Stock', field: 'countInStock' },
            { label: 'Units', field: 'units' },
          ].map(({ label, field }) => (
            <div key={field} className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                className="border p-2 w-full"
                value={editingFinancial?.data?.[field] ?? ''}
                onChange={(e) => {
                  const val = { ...(editingFinancial?.data || {}) };
                  val[field] = e.target.value;
                  setEditingFinancial((prev) => ({ ...prev, data: val }));
                }}
              />
            </div>
          ))}
          <div className="flex justify-between">
            <button
              className="bg-green-500 text-white px-3 py-1"
              onClick={() => {
                const fin = editingFinancial?.data;
                const detailId = editingFinancial?.detailId || newFinancialDetailId;
                const financialId = editingFinancial?.financialId ?? null;
                handleSaveFinancial(
                  editingFinancial?.product || filtered[0],
                  detailId,
                  financialId,
                  fin
                );
              }}
            >
              Save
            </button>
            <button
              className="text-gray-500"
              onClick={() => {
                setEditingFinancial(null);
                setNewFinancialDetailId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductToBusiness;
