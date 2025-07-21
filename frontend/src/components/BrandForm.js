import React, { useState, useMemo } from 'react';
import {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} from '../features/inventory/brandSlice';
// import HeaderPOS from './HeaderPOS';
import POSLayout from '../layouts/POSLayout';

const BrandForm = () => {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [newName, setNewName] = useState('');

  const { data: items = [] } = useGetBrandsQuery();
  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  const [deleteBrand] = useDeleteBrandMutation();

  const suggestions = useMemo(() => {
    if (search.length < 3) return [];
    return items.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  const handleAdd = async () => {
    if (!search.trim()) return;
    try {
      await addBrand({ name: search });
      setSearch('');
    } catch (err) {
      console.error('Error adding brand:', err);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!newName.trim()) {
        alert('Please enter a new name.');
        return;
      }
      await updateBrand({ id: selectedBrand.id, name: newName });
      setSearch('');
      setNewName('');
      setSelectedBrand(null);
    } catch (err) {
      console.error('Error updating brand:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete brand "${selectedBrand.name}"?`)) {
      try {
        await deleteBrand(selectedBrand.id);
        setSearch('');
        setSelectedBrand(null);
      } catch (err) {
        console.error('Error deleting brand:', err);
      }
    }
  };

  return (
    <POSLayout>
    <div className="p-4 mx-auto">
      {/* <HeaderPOS /> */}

      <div className="mt-4 bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2 text-center text-yellow-800">Manage Brands</h2>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search or enter brand name..."
          className="w-full border rounded px-3 py-2 mb-2"
        />

        {search.length >= 3 && suggestions.length > 0 && (
          <ul className="border rounded p-2 bg-gray-50 mb-2 max-h-40 overflow-auto">
            {suggestions.map((b) => (
              <li
                key={b.id}
                onClick={() => {
                  console.log('Brand selected:', b); // ✅ Debug
                  setSelectedBrand(b);
                  setNewName(b.name);
                  setSearch('');
                }}
                className="cursor-pointer hover:bg-blue-100 p-1 rounded"
              >
                {b.name}
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Confirm selection */}
        {selectedBrand && (
          <p className="text-sm text-green-700 mb-1">
            Selected: <strong>{selectedBrand.name}</strong>
          </p>
        )}

        {/* ✅ Update form */}
        {selectedBrand ? (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-lg font-semibold text-yellow-700">Update Brand</h3>

            <div className="mb-2">
              <label className="block text-sm text-gray-600">Old Name:</label>
              <input
                type="text"
                value={selectedBrand.name}
                disabled
                className="w-full border bg-gray-100 px-3 py-2 rounded mt-1 text-gray-600"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm text-gray-600">New Name:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new brand name"
                className="w-full border px-3 py-2 rounded mt-1"
              />
            </div>

            <div className="space-x-2 mt-2">
              <button
                onClick={handleUpdate}
                className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
              >
                Update
              </button>

              <button
                onClick={() => {
                  setSelectedBrand(null);
                  setNewName('');
                }}
                className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 mt-3"
          >
            Add Brand
          </button>
        )}
      </div>
{/* 
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">All Brands</h3>
        <ul className="space-y-1 max-h-60 overflow-auto border rounded p-2 bg-white shadow">
          {items.map((item) => (
            <li key={item.id} className="text-gray-800">
              {item.name}
            </li>
          ))}
        </ul>
      </div> */}
    </div>
    </POSLayout>
  );
};

export default BrandForm;
