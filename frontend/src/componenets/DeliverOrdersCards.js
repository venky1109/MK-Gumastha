import React, { useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const DeliverOrdersCards = ({ orders = [] }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleOrderItems = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

const openInGoogleMaps = (shippingAddress) => {
  if (!shippingAddress) return;

  // ✅ Use coordinates if available
  const coords = shippingAddress.location?.coordinates;
  if (Array.isArray(coords) && coords.length === 2) {
    const [lng, lat] = coords;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
    return;
  }

  // 🔁 Fallback to text address
  const { street = '', city = '', postalCode = '' } = shippingAddress;
  const query = encodeURIComponent(`${street}, ${city}, ${postalCode}`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
  window.open(mapsUrl, '_blank');
};

  return (
    <div className="grid gap-6 p-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {orders.length === 0 ? (
        <p className="text-gray-500 col-span-full text-center">No delivery orders found.</p>
      ) : (
        orders.map((order) => {
          const address = order.shippingAddress;
          return (
            <div
              key={order._id}
              className="border shadow-md rounded-xl p-4 bg-white transition hover:shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">Order : {order._id}</h3>
              <p><strong>Customer:</strong> {order.user?.name || 'NA'}</p>
              <p><strong>Phone:</strong> {order.user?.phoneNo || 'NA'}</p>
              <p className="text-sm mt-1 text-gray-600">
                <strong>Address:</strong>{' '}
                {address ? `${address.street}, ${address.city} - ${address.postalCode}` : 'NA'}
              </p>

              <div className="mt-4 flex justify-between items-center gap-2">
                <button
                  onClick={() => toggleOrderItems(order._id)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {expandedOrderId === order._id ? 'Hide Items' : '📦 View Items'}
                </button>

                <button
                  onClick={() => openInGoogleMaps(address)}
                  className="flex items-center gap-1 text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <FaMapMarkerAlt />
                  Get Location
                </button>
              </div>

              {expandedOrderId === order._id && (
                <ul className="mt-4 text-sm bg-gray-50 p-3 rounded">
                  {order.orderItems?.map((item, idx) => (
                    <li key={idx} className="border-b py-1">
                      🛒 {item.name} – {item.qty} {item.units} ({item.brand})
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default DeliverOrdersCards;
