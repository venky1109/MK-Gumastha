import React, { useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { addCatalog, fetchCatalogs } from '../features/catalogs/catalogSlice';
// import { useAuth } from '../context/AuthContext';

function CatalogForm() {
  const dispatch = useDispatch();
  // const { token }=useAuth();
  const token = useSelector((state) => state.posUser.userInfo?.token);

  const [newCatalog, setNewCatalog] = useState({
    categoryName: '',
    subcategoryName: '',
    productName: '',
    quantity: '',
    description: '',
    brand: '',
  });

  const handleCatalogChange = (e) => {
    const { name, value } = e.target;
    setNewCatalog((prev) => ({ ...prev, [name]: value }));
  };

  const handleCatalogSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addCatalog({ payload: newCatalog, token })).unwrap();
      alert('Catalog added successfully!');
      dispatch(fetchCatalogs({ token }));
      setNewCatalog({
        categoryName: '',
        subcategoryName: '',
        productName: '',
        quantity: '',
        description: '',
        brand: '',
      });
    } catch (err) {
      console.error('Failed to add catalog:', err);
      alert('Failed to add catalog');
    }
  };

  return (
    <form className="grid grid-cols-2 gap-4 border p-4 bg-gray-50 mb-6 rounded" onSubmit={handleCatalogSubmit}>
      <input name="categoryName" placeholder="Category" onChange={handleCatalogChange} className="border p-2" required />
      <input name="subcategoryName" placeholder="Subcategory" onChange={handleCatalogChange} className="border p-2" />
      <input name="productName" placeholder="Product Name" onChange={handleCatalogChange} className="border p-2" required />
      <input name="quantity" placeholder="Unit (e.g. 1kg)" onChange={handleCatalogChange} className="border p-2" required />
      <input name="description" placeholder="Description" onChange={handleCatalogChange} className="border p-2 col-span-2" />
      <input name="brand" placeholder="Brand" onChange={handleCatalogChange} className="border p-2" />
      <div className="col-span-2 text-right">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Catalog</button>
      </div>
    </form>
  );
}

export default CatalogForm;
