import React, { useState } from 'react';
import {
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '../features/inventory/categorySlice';
// import  HeaderPOS from './HeaderPOS'; 
import POSLayout from '../layouts/POSLayout';

const CategoryForm = () => {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { data: items = [] } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateCategory({ id: editingId, name });
    } else {
      addCategory({ name });
    }
    setName('');
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setName(item.name);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteCategory(id);
    }
  };

  return (
    <POSLayout>
    <div className="p-4">
       {/* <HeaderPOS /> */}
      <h2 className="text-xl font-bold mb-2 mt-2 text-yellow-800 text-center">CATEGORY FORM</h2>
      <form onSubmit={handleSubmit} className="space-x-2 mb-4 text-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          className="border px-2 py-1"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
      </form>
      <ul>
        {items?.map((item) => (
          <li key={item.id} className="flex justify-between items-center mb-1">
            <span>{item.name}</span>
            <div className="space-x-2">
              <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
              <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </POSLayout>
  );
};

export default CategoryForm;
