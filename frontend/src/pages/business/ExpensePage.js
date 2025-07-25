import React, { useState, useEffect } from 'react';
import {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
} from '../../features/inventory/expenseSlice';
import { useGetAllPurchasesQuery } from '../../features/inventory/purchaseSlice'; // 👈 ADD THIS
import POSLayout from '../../layouts/POSLayout'


const ExpensePage = () => {
  const [role, setRole] = useState(null);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]); // 👈 Date filter

  const [formData, setFormData] = useState({
    purchaseIDs: [], 
    type: '',
    amount: '',
    raisedBy: '',
    expenseRaisedDate: new Date().toISOString().split('T')[0],
  });

  const { data: expenses = [], isLoading } = useGetExpensesQuery();
  const { data: purchases = [] } = useGetAllPurchasesQuery(); // 👈 GET purchases
  const [addExpense] = useAddExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();

  console.log(expenses)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('posUserInfo'));
    if (user) {
      setRole(user.role);
      setFormData((prev) => ({ ...prev, raisedBy: user.name || user.role }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleAddExpense = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    purchaseIDs: formData.purchaseIDs.join(','), // <-- convert to string
    status: 'raised',
  };

  await addExpense(payload);

  setFormData({
    purchaseIDs: [],
    type: '',
    amount: '',
    raisedBy: role,
    expenseRaisedDate: new Date().toISOString().split('T')[0],
  });
};

  const handleStatusChange = async (id, status) => {
    await updateExpense({ id, status });
  };

const handlePurchaseClick = (purchaseID) => {
  setFormData((prev) => {
    const alreadySelected = prev.purchaseIDs.includes(purchaseID);
    const updated = alreadySelected
      ? prev.purchaseIDs.filter(id => id !== purchaseID)
      : [...prev.purchaseIDs, purchaseID];
    return { ...prev, purchaseIDs: updated };
  });
};

 const filteredPurchases = purchases.filter((p) =>
  p.purchaseDate?.startsWith(dateFilter)
);
// 👈 Filter by date
//   console.log('123'+JSON.stringify(purchases))
//     console.log('1234'+JSON.stringify(filteredPurchases))

  return (
    <POSLayout>
    <div className="p-4">
      <h2 className="text-xl font-bold text-yellow-700 mb-4">Expenses</h2>

      {/* 📅 Date Filter for Purchases */}
      <div className="mb-4">
        <label className="mr-2">Filter Purchases by Date:</label>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      {/* 🛒 Purchase List */}
      <div className="grid gap-2 mb-6">
        {filteredPurchases.map((purchase) => {
  const isSelected = formData.purchaseIDs.includes(purchase.purchaseID);
  return (
    <div
      key={purchase.key}
      className={`p-2 border rounded cursor-pointer ${
        isSelected ? 'bg-green-100' : 'hover:bg-gray-100'
      }`}
      onClick={() => handlePurchaseClick(purchase.purchaseID)}
    >
      <p><strong>Purchase ID:</strong> {purchase.purchaseID}</p>
      <p><strong>Date:</strong> {purchase.purchaseDate}</p>
      <p><strong>Price:</strong> ₹{purchase.price}</p>
    </div>
  );
})}

      </div>

      {/* ➕ Expense Form */}
     <form
  onSubmit={handleAddExpense}
  className="bg-white p-4 shadow rounded-lg mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
>
  {/* 📋 Selected Purchase IDs */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Selected Purchase IDs
    </label>
    <input
      type="text"
      name="purchaseIDs"
      value={formData.purchaseIDs.join(', ')}
      readOnly
      className="border p-2 rounded w-full bg-gray-100"
    />
  </div>

  {/* ✏️ Expense Type */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Expense Type
    </label>
    <input
      type="text"
      name="type"
      placeholder="e.g., Shipping"
      value={formData.type}
      onChange={handleInputChange}
      required
      className="border p-2 rounded w-full"
    />
  </div>

  {/* 💰 Amount */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Amount (₹)
    </label>
    <input
      type="number"
      name="amount"
      placeholder="Amount"
      value={formData.amount}
      onChange={handleInputChange}
      required
      className="border p-2 rounded w-full"
    />
  </div>

  {/* 🆕 Submit Button */}
  <div className="md:col-span-2">
    <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded w-full"
    >
      Raise Expense
    </button>
  </div>
</form>

      {/* 🧾 Expense List */}
      {isLoading ? (
        <p>Loading expenses...</p>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <div
              key={expense.expenseID}
              className="border p-4 rounded shadow flex justify-between items-start flex-col md:flex-row"
            >
              <div>
                <p><strong>Purchase IDs:</strong> {expense.purchaseIDs.join(', ')}</p>

                <p><strong>Type:</strong> {expense.type}</p>
                <p><strong>Amount:</strong> ₹{expense.amount}</p>
                <p><strong>Status:</strong> {expense.status}</p>
                <p><strong>Raised By:</strong> {expense.raisedBy}</p>
                <p><strong>Date:</strong> {expense.expenseRaisedDate}</p>
              </div>
              {role === 'ADMIN' && expense.status === 'raised' && (
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(expense.expenseID, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => handleStatusChange(expense.expenseID, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </POSLayout>
  );
};

export default ExpensePage;
