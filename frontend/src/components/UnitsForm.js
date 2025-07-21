import React, { useState } from 'react';
import {
  useGetUnitsQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation
} from '../features/inventory/unitSlice';
import POSLayout from '../layouts/POSLayout';

const UnitForm = () => {
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { data: items = [] } = useGetUnitsQuery();
  const [addUnit] = useAddUnitMutation();
  const [updateUnit] = useUpdateUnitMutation();
  const [deleteUnit] = useDeleteUnitMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateUnit({ id: editingId, name });
    } else {
      addUnit({ name });
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
      deleteUnit(id);
    }
  };

  return (
    <POSLayout>
    <div className="p-4">
      <h2 className="text-lg font-bold text-center text-yellow-800 mb-2">Unit Form</h2>
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter unit name"
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

export default UnitForm;
