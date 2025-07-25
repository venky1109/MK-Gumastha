import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt, FaShoppingCart, FaUsers, FaBoxOpen, FaCubes,
  FaMoneyBillAlt, FaChartBar, FaCog, FaQuestionCircle, FaBoxes, FaPlus,
  FaFolderOpen, FaTags, FaStore, FaCube, FaRuler, FaSignOutAlt
} from 'react-icons/fa';

import { useDispatch } from "react-redux";
import { logout } from "../features/auth/posUserSlice";

const Sidebar = ({ mobileOpen = false, onClose }) => {
  const dispatch = useDispatch();
  // const role = useSelector((state) => state.posUser.userInfo?.role);
  // const name = useSelector((state) => state.posUser.userInfo?.username);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("posUserInfo");
    window.location.href = "/login";
  };

  const navigate = useNavigate();
  const [openSubMenu, setOpenSubMenu] = React.useState('');

  const handleToggleSubmenu = (menuKey) => {
    setOpenSubMenu(prev => prev === menuKey ? '' : menuKey);
  };

  const mainLinks = [
    { label: 'Sales', icon: <FaShoppingCart />, path: '/pos' },
    { label: 'Customers', icon: <FaUsers />, path: '/customers' },
    { label: 'Suppliers', icon: <FaCubes />, path: '/suppliers' },
    { label: 'Reports', icon: <FaChartBar />, path: '/reports' },
    { label: 'Users', icon: <FaUsers />, path: '/users' },
    { label: 'Settings', icon: <FaCog />, path: '/settings' },
    { label: 'Help', icon: <FaQuestionCircle />, path: '/help' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed md:relative right-0 h-screen bg-green-800 text-white z-50 w-64 transform transition-transform duration-300 flex flex-col justify-between ${
         mobileOpen ? 'translate-x-0' : 'translate-x-full'

        } md:translate-x-0 md:block`}
      >
        <div>
          {/* Logo */}
          <div className="text-left px-4 font-bold text-lg py-4 border-b border-green-700">
            ManaKirana Inventory
          </div>

          {/* Navigation */}
          <nav className="space-y-1 px-3 mt-4">
            <NavItem icon={<FaTachometerAlt />} label="Dashboard" onClick={() => { navigate('/dashboard'); onClose?.(); }} />

            {/* Business */}
            <div>
              <div onClick={() => handleToggleSubmenu('business')} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <span className="text-xl"><FaBoxOpen /></span>
                <span>Business</span>
              </div>
              {openSubMenu === 'business' && (
                <div className="ml-6 text-sm space-y-1">
                  <SubItem icon={<FaShoppingCart />} label="Purchase" onClick={() => navigate('/business/purchase')} />
                  <SubItem icon={<FaMoneyBillAlt />} label="Expense" onClick={() => navigate('/business/expense')} />
                  <SubItem icon={<FaBoxes />} label="Packing" onClick={() => navigate('/business/packing')} />
                  <SubItem icon={<FaTags />} label="labeling" onClick={() => navigate('/business/print-labels')} />
                  <SubItem icon={<FaPlus />} label="Product to Business" onClick={() => navigate('/business/add-product')} />
                </div>
              )}
            </div>

            {/* Catalog */}
            <div>
              <div onClick={() => handleToggleSubmenu('catalog')} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
                <span className="text-xl"><FaFolderOpen /></span>
                <span>Catalog</span>
              </div>
              {openSubMenu === 'catalog' && (
                <div className="ml-6 text-sm space-y-1">
                  <SubItem icon={<FaPlus />} label="Category" onClick={() => navigate('/catalog/category')} />
                  <SubItem icon={<FaTags />} label="Brand" onClick={() => navigate('/catalog/brand')} />
                  <SubItem icon={<FaStore />} label="Outlet" onClick={() => navigate('/catalog/outlet')} />
                  <SubItem icon={<FaCube />} label="Product" onClick={() => navigate('/catalog/product')} />
                  <SubItem icon={<FaRuler />} label="Units" onClick={() => navigate('/catalog/units')} />
                </div>
              )}
            </div>

            {/* Main Nav Items */}
            {mainLinks.map((link, index) => (
              <NavItem key={index} icon={link.icon} label={link.label} onClick={() => { navigate(link.path); onClose?.(); }} />
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </div>
);

const SubItem = ({ icon, label, onClick }) => (
  <div onClick={onClick} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-700 rounded text-white">
    {icon}
    <span>{label}</span>
  </div>
);

export default Sidebar;
