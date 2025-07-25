import React from 'react';

const PendingApprovalPurchases = ({ purchases, onApprove, onReject }) => {
  return (
    <div>
      <h2>Approval Pending Purchases</h2>
      <ul>
        {purchases.length === 0 ? (
          <p>No pending approval purchases.</p>
        ) : (
          purchases.map((purchase) => (
            <li key={purchase.key}>
              <p>Category ID: {purchase.categoryID}</p>
              <p>Brand ID: {purchase.brandID}</p>
              <p>Product ID: {purchase.productID}</p>
              <p>Quantity: {purchase.quantity}</p>
              <p>Price: {purchase.price}</p>
              <p>GST: {purchase.GST}</p>
              <button onClick={() => onApprove(purchase.purchaseID)}>Approve</button>
              <button onClick={() => onReject(purchase.purchaseID)}>Reject</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PendingApprovalPurchases;
