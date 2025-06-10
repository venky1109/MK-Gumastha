import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../componenets/Sidebar';

function Inventory() {
  // const [activeForm, setActiveForm] = useState('catalog');
  const [openSubMenu, setOpenSubMenu] = useState('items');

  return (
    <div className="flex min-h-screen">
      <Sidebar
        // onSelect={(type) => setActiveForm(type)}
        openSubMenu={openSubMenu}
        setOpenSubMenu={setOpenSubMenu}
      />

      <div className="p-4 flex-1 bg-gray-100">
        <h2 className="text-2xl font-semibold mb-4">📦 Inventory Management</h2>

        <Outlet />
      </div>
    </div>
  );
}

export default Inventory;
