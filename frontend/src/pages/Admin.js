import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../componenets/Sidebar';
import { FaTachometerAlt, FaUsers, FaShoppingCart, FaCubes, FaBoxOpen, FaMoneyBillAlt, FaChartBar, FaCog, FaSms, FaQuestionCircle, FaMapMarkerAlt } from 'react-icons/fa';

const summaryData = [
  { title: 'Total Purchase Due', value: '₹ 307,144.00', color: 'bg-sky-500', icon: '🛍️' },
  { title: 'Total Sales Due', value: '₹ 4,385.00', color: 'bg-orange-500', icon: '💰' },
  { title: 'Total Sales Amount', value: '₹ 338,660.70', color: 'bg-green-600', icon: '🛒' },
  { title: 'Total Expense Amount', value: '₹ 400.00', color: 'bg-red-500', icon: '💸' },
  { title: "Today's Total Purchase", value: '₹ 310,475.00', color: 'bg-sky-500', icon: '🛍️' },
  { title: "Today Payment Received (Sales)", value: '₹ 345,935.70', color: 'bg-orange-500', icon: '💰' },
  { title: "Today's Total Sales", value: '₹ 350,320.70', color: 'bg-green-600', icon: '🛒' },
  { title: "Today's Total Expense", value: '₹ 400.00', color: 'bg-red-500', icon: '💸' },
  { title: 'Customers', value: '7', color: 'bg-pink-600', icon: '👥' },
  { title: 'Suppliers', value: '8', color: 'bg-purple-600', icon: '👤' },
  { title: 'Purchase Invoice', value: '10', color: 'bg-blue-700', icon: '📄' },
  { title: 'Sales Invoice', value: '37', color: 'bg-green-700', icon: '🧾' }
];

const items = [
  { id: 1, name: 'Apple Earpods', price: '₹ 13,200.00' },
  { id: 2, name: 'iPhone 11', price: '₹ 115,500.00' },
  { id: 3, name: 'Redmi Pro 7 Mobile', price: '₹ 11,000.00' },
  { id: 4, name: 'Lifebuoy', price: '₹ 55.00' }
];

function Admin() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen text-sm">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 bg-gray-100">
        {/* Top Header */}
        <div className="bg-white p-4 border-b shadow text-xl font-bold flex justify-between items-center">
          <span>Dashboard <span className="text-sm font-normal">Overall Information on Single Screen</span></span>
          <div className="space-x-4 text-sm">
            <button className="hover:underline">English</button>
            <button className="hover:underline">POS</button>
            <button className="hover:underline">Dashboard</button>
            <button className="hover:underline">Admin</button>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-green-600 text-white text-center p-2 text-sm">
          Ultimate Inventory with POS new Version 2.4 released. Faster and Customizable Application Software.
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {summaryData.map((item, idx) => (
            <div key={idx} className={`text-white p-4 rounded shadow ${item.color}`}>
              <div className="text-sm font-semibold">{item.icon} {item.title}</div>
              <div className="text-lg font-bold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Customer/Supplier Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-4 mb-6">
          <InfoCard color="border-pink-500" text="CUSTOMERS" value="7" />
          <InfoCard color="border-purple-600" text="SUPPLIERS" value="8" />
          <InfoCard color="border-blue-700" text="PURCHASE INVOICE" value="10" />
          <InfoCard color="border-green-700" text="SALES INVOICE" value="37" />
        </div>

        {/* Chart + Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 pb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-semibold mb-2">PURCHASE & SALES BAR CHART</h3>
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-600">
              [Bar Chart Placeholder]
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-md font-semibold mb-2">RECENTLY ADDED ITEMS</h3>
            <table className="min-w-full text-sm text-left border">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2 border">Sl.No</th>
                  <th className="p-2 border">Item Name</th>
                  <th className="p-2 border">Item Sales Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="text-center">
                    <td className="border p-2">{item.id}</td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-gray-700 cursor-pointer rounded">
    {icon}
    <span>{label}</span>
  </div>
);

const InfoCard = ({ value, text, color }) => (
  <div className={`bg-white p-4 rounded shadow border ${color} text-gray-800`}>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm">{text}</div>
    <button className="text-xs mt-2 text-blue-600 hover:underline">VIEW ➤</button>
  </div>
);

export default Admin;
