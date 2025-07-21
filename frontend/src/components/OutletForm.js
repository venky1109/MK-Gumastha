import React, { useState } from 'react';
import {
  useGetOutletsQuery,
  useAddOutletMutation,
  useUpdateOutletMutation,
  useDeleteOutletMutation
} from '../features/inventory/outletSlice';
import POSLayout from '../layouts/POSLayout';

const OutletForm = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState(''); // plain text input
  const [editingId, setEditingId] = useState(null);

  const { data: items = [] } = useGetOutletsQuery();
  const [addOutlet] = useAddOutletMutation();
  const [updateOutlet] = useUpdateOutletMutation();
  const [deleteOutlet] = useDeleteOutletMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !location) return alert('Please fill both fields');

    const safeLocation = typeof location === 'string' ? location : JSON.stringify(location);

    if (editingId) {
      await updateOutlet({ id: editingId, name, location: safeLocation });
    } else {
      await addOutlet({ name, location: safeLocation });
    }

    setName('');
    setLocation('');
    setEditingId(null);
  };

  const handleEdit = (item) => {
    let parsedLocation = '';
    try {
      parsedLocation = typeof item.location === 'string' ? JSON.parse(item.location) : item.location;
    } catch (e) {
      parsedLocation = '';
    }
    setName(item.name);
    setLocation(typeof parsedLocation === 'object' ? JSON.stringify(parsedLocation) : parsedLocation);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this outlet?')) {
      deleteOutlet(id);
    }
  };

  return (
    <POSLayout>
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center text-yellow-800 mb-4">
          {editingId ? 'Edit Outlet' : 'Add Outlet'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2 mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Outlet Name"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (JSON or text)"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {editingId ? 'Update Outlet' : 'Add Outlet'}
          </button>
        </form>

        <ul className="space-y-2">
          {items.map((item) => {
            let parsedLocation = '';
            try {
              parsedLocation = typeof item.location === 'string'
                ? JSON.parse(item.location)
                : item.location;
            } catch {
              parsedLocation = item.location;
            }

            return (
              <li key={item.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {typeof parsedLocation === 'object'
                      ? `${parsedLocation?.city ?? ''}, ${parsedLocation?.code ?? ''}`
                      : parsedLocation}
                  </div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600">Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </POSLayout>
  );
};

export default OutletForm;
