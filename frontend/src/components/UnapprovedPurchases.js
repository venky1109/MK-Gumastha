import React from 'react';

const UnapprovedPurchases = ({ purchases, onApprove, onReject }) => {
  // Default to an empty array if purchases is undefined
  const unapprovedPurchases = purchases ? purchases.filter((purchase) => purchase.status === 'unapproved') : [];

  return (
    <div>
      <h2>Unapproved Purchases</h2>

      {/* Check if there are any unapproved purchases */}
      {unapprovedPurchases.length === 0 ? (
        <p>No unapproved purchases found.</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {unapprovedPurchases.map((purchase) => (
            <div
              key={purchase.purchaseID}
              className="border p-4 rounded-md shadow-md w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <p><strong>Category ID:</strong> {purchase.categoryID}</p>
              <p><strong>Brand ID:</strong> {purchase.brandID}</p>
              <p><strong>Product ID:</strong> {purchase.productID}</p>
              <p><strong>Quantity:</strong> {purchase.quantity}</p>
              <p><strong>Price:</strong> {purchase.price}</p>
              <p><strong>GST:</strong> {purchase.GST}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => onApprove(purchase.key)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject(purchase.key)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnapprovedPurchases;
