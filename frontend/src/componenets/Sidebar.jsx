import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaShoppingCart, FaUsers, FaBoxOpen, FaCubes,
  FaMoneyBillAlt, FaMapMarkerAlt, FaChartBar, FaCog, FaSms, FaQuestionCircle
} from 'react-icons/fa';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState('');
  const navigate = useNavigate();

  const handleToggleSubmenu = (menuKey) => {
    setOpenSubMenu(prev => prev === menuKey ? '' : menuKey);
  };

  const mainLinks = [
    { label: 'Sales', icon: <FaShoppingCart />, path: '/pos' },
    { label: 'Customers', icon: <FaUsers />, path: '/customers' },
    { label: 'Purchase', icon: <FaBoxOpen />, path: '/purchase' },
    { label: 'Suppliers', icon: <FaCubes />, path: '/suppliers' },
    { label: 'Expenses', icon: <FaMoneyBillAlt />, path: '/expenses' },
    { label: 'Places', icon: <FaMapMarkerAlt />, path: '/places' },
    { label: 'Reports', icon: <FaChartBar />, path: '/reports' },
    { label: 'Users', icon: <FaUsers />, path: '/users' },
    { label: 'SMS', icon: <FaSms />, path: '/sms' },
    { label: 'Settings', icon: <FaCog />, path: '/settings' },
    { label: 'Help', icon: <FaQuestionCircle />, path: '/help' }
  ];

  return (
    <div className={`bg-gray-800 text-white h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} relative`}>
      {/* Collapse Toggle */}
      <button
        className="absolute top-3 right-[-12px] bg-blue-600 p-1 rounded-full shadow text-xs"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? '➡' : '⬅'}
      </button>

      {/* Logo */}
      <div className="text-center font-bold text-lg py-4 border-b border-gray-700">
        {collapsed ? 'UI' : 'Ultimate Inventory'}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 px-2 mt-4">

        {/* Dashboard outside the map */}
        <NavItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          collapsed={collapsed}
          onClick={() => navigate('/dashboard')}
        />

        {/* Items with submenu */}
        <div className="space-y-1">
          <div
            onClick={() => handleToggleSubmenu('items')}
            className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer relative group"
          >
            <span className="text-xl"><FaBoxOpen /></span>
            {!collapsed && <span>Items</span>}
            {collapsed && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 z-10">
                Items
              </span>
            )}
          </div>

          {/* Submenu */}
          {openSubMenu === 'items' && !collapsed && (
            <div className="ml-8 text-sm space-y-1">
              <div onClick={() => navigate('/inventory/catalog')} className="cursor-pointer p-1 hover:bg-gray-700 rounded">📂 Catalog</div>
              <div onClick={() => navigate('/inventory/product')} className="cursor-pointer p-1 hover:bg-gray-700 rounded">📦 Product</div>
            </div>
          )}
        </div>

        {/* Other main links */}
        {mainLinks.map((link, index) => (
          <NavItem
            key={index}
            icon={link.icon}
            label={link.label}
            collapsed={collapsed}
            onClick={() => navigate(link.path)}
          />
        ))}
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, collapsed, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer relative group"
  >
    <span className="text-xl">{icon}</span>
    {!collapsed && <span>{label}</span>}
    {collapsed && (
      <span className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 z-10">
        {label}
      </span>
    )}
  </div>
);

export default Sidebar;
