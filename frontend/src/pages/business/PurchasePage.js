import React, { useState, useEffect } from 'react';
import PurchaseForm from '../../components/PurchaseInputForm'; // Import your purchase form component
// import ApprovalPendingPurchases from '../../components/PendingApprovalPurchases'; // Import approval pending purchases component
import { useGetAllPurchasesQuery, useAddPurchaseMutation, useUpdatePurchaseMutation } from '../../features/inventory/purchaseSlice'; // Updated to use correct slice for API calls
import { useGetCategoriesQuery } from '../../features/inventory/categorySlice';
import { useGetBrandsQuery } from '../../features/inventory/brandSlice';
import { useGetUnitsQuery } from '../../features/inventory/unitSlice'; // adjust path if needed
import { useGetProductsQuery } from '../../features/inventory/productSlice';

import POSLayout from '../../layouts/POSLayout';

const PurchasePage = () => {
  const [role, setRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { data: purchases, isLoading, error } = useGetAllPurchasesQuery();  // Fetch all purchases
  const { data: categories } = useGetCategoriesQuery(); // Fetch categories
  const { data: brands } = useGetBrandsQuery(); // Fetch brands
  const { data: units } = useGetUnitsQuery(); // Fetch units
  const { data: products = [] } = useGetProductsQuery(); // Fetch products from the API
  const [addPurchase] = useAddPurchaseMutation();  // Add new purchase
  const [updatePurchase] = useUpdatePurchaseMutation();  // Update purchase (approve/reject)

  useEffect(() => {
    const posUserInfo = JSON.parse(localStorage.getItem('posUserInfo'));
    if (posUserInfo) {
      setRole(posUserInfo.role); // Set role dynamically from localStorage
    }
  }, []);

  const handleAddPurchase = (purchaseData) => {
    addPurchase(purchaseData)
      .unwrap()
      .then(() => {
        setShowForm(false);
      })
      .catch((error) => console.log(error));
  };

  const handleApprovePurchase = (purchaseKey) => {
    updatePurchase({ key: purchaseKey, status: 'approved' })
      .unwrap()
      .then(() => {
        console.log(`Purchase ${purchaseKey} approved`);
        // Update state to reflect approved purchase without refetching
      })
      .catch((error) => console.log(error));
  };

  const handleRejectPurchase = (purchaseKey) => {
    updatePurchase({ key: purchaseKey, status: 'rejected' })
      .unwrap()
      .then(() => {
        console.log(`Purchase ${purchaseKey} rejected`);
        // Update state to reflect rejected purchase without refetching
      })
      .catch((error) => console.log(error));
  };

  return (
    
    <div>
        <POSLayout>
      <h1 className="text-2xl font-semibold text-center text-yellow-700 mt-4">Purchase Management</h1>

      {/* Only show the "Add Purchase" button for certain roles */}
      {(role === 'INVENTORY' || role === 'ADMIN' || role === 'MANAGER' || role === 'DIRECTOR') && (
        <button
          onClick={() => setShowForm(!showForm)}  // Toggle form visibility on button click
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 ml-2 mt-5"
        >
          {showForm ? 'Cancel' : 'Request New Purchase'} {/* Toggle button text */}
        </button>
      )}

      {/* Show purchase form for adding a new purchase */}
      {showForm && (
        <PurchaseForm
          onSubmit={handleAddPurchase}
          onCancel={() => setShowForm(false)}
          products={products}  // Pass products to form
          categories={categories}  // Pass categories to form
          brands={brands}  // Pass brands to form
          units={units}  // Pass units to form
        />
      )}

      {/* Loading or Error handling */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error loading purchases</p>}

      {/* Unapproved Purchases List - Displayed only for specific roles */}
{(role === 'ADMIN' || role === 'MANAGER' || role === 'DIRECTOR') && (
  <div>
    {/* Only show the header if there are unapproved purchases */}
    {purchases && purchases.filter((purchase) => purchase.status === 'unapproved').length > 0 && (
      <h2 className="text-2xl font-semibold text-center text-yellow-700 mt-4mb-4">Unapproved Purchases</h2>
    )}

    {/* Check if there are any unapproved purchases */}
    {purchases && purchases.filter((purchase) => purchase.status === 'unapproved').length === 0 ? (
      <p>No unapproved purchases found.</p>
    ) : (
      <div className="flex flex-wrap gap-4">
        {purchases?.map((purchase) =>
          purchase.status === 'unapproved' ? (
            <div
              key={purchase.key}
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
                  onClick={() => handleApprovePurchase(purchase.key)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRejectPurchase(purchase.key)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : null
        )}
      </div>
    )}
  </div>
)}


      {/* Approval Pending Purchases List - Displayed only for specific roles */}
      {/* {(role === 'ADMIN' || role === 'MANAGER' || role === 'DIRECTOR') && (
        <ApprovalPendingPurchases
          purchases={purchases ? purchases.filter((purchase) => purchase.status === 'pending') : []}
          onApprove={handleApprovePurchase}
          onReject={handleRejectPurchase}
        />
      )} */}
      </POSLayout>
    </div>
  );
};

export default PurchasePage;
