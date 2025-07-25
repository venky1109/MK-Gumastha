import React, { useState } from 'react';
import {
  useAddProductMutation,
  useGetProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} from '../features/inventory/productSlice';
import { useGetCategoriesQuery } from '../features/inventory/categorySlice';
import { useGetBrandsQuery } from '../features/inventory/brandSlice';
import { useGetUnitsQuery } from '../features/inventory/unitSlice'; // adjust path if needed
import POSLayout from '../layouts/POSLayout';

const ProductForm = () => {
  const { data: products = [], refetch } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();
  const { data: units = [] } = useGetUnitsQuery();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    category_id: '',
    brand_id: '',
    description: '',
    image_url: '',
    quantity: 0,
    unit_id: '',
    price: 0,
    dprice: 0,
    discount: 0,
    outlets: [],  // Array to hold multiple outlets
    newBarcodeInput: "", // Input for barcode
    barcodes: [],  // Array to hold barcode(s)
  });

  const [editingId, setEditingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [addProduct] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  // Function to handle barcode input change
 
  // Function to handle field changes like price, discount, etc.
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);

    if (name === 'price' || name === 'dprice') {
      const updatedForm = { ...form, [name]: Math.ceil(numericValue) };
      const price = parseFloat(updatedForm.price);
      const dprice = parseFloat(updatedForm.dprice);
      if (price && dprice) {
        updatedForm.discount = +(((price - dprice) / price) * 100).toFixed(2);
      }
      setForm(updatedForm);
    } else if (name === 'discount') {
      const discount = numericValue;
      const price = parseFloat(form.price);
      if (price && discount >= 0) {
        const dprice = Math.ceil(price * (1 - discount / 100));
        setForm({ ...form, discount, dprice });
      } else {
        setForm({ ...form, discount });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddProduct = async () => {
    const { name, slug, category_id, brand_id } = form;
    if (!name || !slug || !category_id || !brand_id) {
      return alert('Please fill all required fields');
    }

    await addProduct(form);
    setForm({
      name: '',
      slug: '',
      category_id: '',
      brand_id: '',
      description: '',
      image_url: '',
      quantity: 0,
      unit_id: '',
      price: 0,
      dprice: 0,
      discount: 0,
      outlets: [],  // Reset outlets
      barcodes: [],  // Reset barcodes
      barcodeInput: '', // Clear the barcode input field after adding
    });
    setEditingId(null);
    refetch();
  };

  const handleUpdateProduct = async () => {
    const { name, slug, category_id, brand_id } = form;
    if (!editingId) return;

    if (!name || !slug || !category_id || !brand_id) {
      return alert('Please fill all required fields');
    }

    await updateProduct({ id: editingId, ...form }).unwrap();
    setForm({
      name: '',
      slug: '',
      category_id: '',
      brand_id: '',
      description: '',
      image_url: '',
      quantity: 0,
      unit_id: '',
      price: 0,
      dprice: 0,
      discount: 0,
      outlets: [], // Reset outlets
      barcodes: [], // Reset barcodes
    });

    setEditingId(null);
    refetch();
  };

  const handleSuggestionClick = (product) => {
    const parsedBarcodes = Array.isArray(product.barcode) ? product.barcode : JSON.parse(product.barcode || '[]');
    const parsedOutlets = Array.isArray(product.outlets) ? product.outlets : JSON.parse(product.outlets || '[]');

    setForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id,
      brand_id: product.brand_id,
      description: product.description,
      image_url: product.image_url || '',
      quantity: product.quantity || '',
      unit_id: product.unit_id || '',
      price: product.price || '',
      dprice: product.dprice || '',
      discount: product.discount || '',
      barcodes: parsedBarcodes, // Ensure barcodes are an array
      outlets: parsedOutlets, // Ensure outlets are an array
    });

    setEditingId(product.id);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, slug, category_id, brand_id } = form;
    if (!name || !slug || !category_id || !brand_id) {
      return alert('Please fill all required fields');
    }

    if (editingId) {
      await updateProduct({ id: editingId, ...form });
      setEditingId(null);
    } else {
      await addProduct(form);
    }

    setForm({
      name: '',
      slug: '',
      category_id: '',
      brand_id: '',
      description: '',
      image_url: '',
      quantity: 0,
      unit_id: '',
      price: 0,
      dprice: 0,
      discount: 0,
      barcodes: [], // Reset barcodes
      outlets: [], // Reset outlets
    });
    refetch();
  };

  const handleEdit = (product) => {
    handleSuggestionClick(product);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      refetch();
    }
  };
  // Handle the addition of a barcode
  const handleAddBarcode = () => {
    if (form.newBarcodeInput.trim()) {
      setForm((prevState) => ({
        ...prevState,
        barcodes: [...prevState.barcodes, form.newBarcodeInput.trim()],
        newBarcodeInput: '',  // Clear the barcode input field after adding
      }));
    }
  };

  // Handle changes to a specific barcode input (for editing)
//   const handleBarcodeChange = (index, value) => {
//     const updatedBarcodes = [...form.barcodes];
//     updatedBarcodes[index] = value;
//     setForm({ ...form, barcodes: updatedBarcodes });
//   };

  // Handle the removal of a barcode
  const handleRemoveBarcode = (index) => {
    const updatedBarcodes = form.barcodes.filter((_, i) => i !== index);
    setForm({ ...form, barcodes: updatedBarcodes });
  };

//   const handleAddOutlet = () => {
//     setForm((prevState) => ({
//       ...prevState,
//       outlets: [...prevState.outlets, ''], // Add an empty string for a new outlet
//     }));
//   };

//   const handleOutletChange = (index, value) => {
//     const newOutlets = [...form.outlets];
//     newOutlets[index] = value;
//     setForm({ ...form, outlets: newOutlets });
//   };

//   const handleRemoveOutlet = (index) => {
//     const newOutlets = form.outlets.filter((_, i) => i !== index);
//     setForm({ ...form, outlets: newOutlets });
//   };
  return (
<POSLayout>
  <div className="p-4">
    <h2 className="text-xl font-semibold text-center text-yellow-800 mt-4 mb-4">MANAGE PRODUCTS</h2>

    <form onSubmit={handleSubmit} className="border p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed grid layout to 2 columns */}
        {/* Product Name */}
        <div className="relative col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product Name"
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="Slug"
            className="border p-2 w-full"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category_id"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select
            name="brand_id"
            value={form.brand_id}
            onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            placeholder="Quantity"
            className="border p-2 w-full"
          />
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit_id"
            value={form.unit_id}
            onChange={(e) => setForm({ ...form, unit_id: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Select Unit</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">MRP Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleFieldChange}
            placeholder="MRP Price"
            className="border p-2 w-full"
          />
        </div>

        {/* Discount Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
          <input
            type="number"
            name="dprice"
            value={form.dprice}
            onChange={handleFieldChange}
            placeholder="Discounted Price"
            className="border p-2 w-full"
          />
        </div>

        {/* Discount Percentage */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleFieldChange}
            placeholder="Discount %"
            className="border p-2 w-full"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 w-full"
          />
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="Image URL"
            className="border p-2 w-full"
          />
        </div>

        {/* Barcodes Input Section */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Existing Barcodes</label>
          {form.barcodes && form.barcodes.length > 0 ? (
            form.barcodes.map((barcode, idx) => (
              <div key={idx} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={barcode}
                  readOnly
                  className="border p-2 w-full bg-gray-100 text-gray-700"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveBarcode(idx)}
                  className="text-red-600 font-bold"
                >
                  ❌
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No barcodes yet.</p>
          )}
        </div>

        {/* New Barcode Entry */}
        <div className="md:col-span-2 mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter New Barcode</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={form.newBarcodeInput || ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, newBarcodeInput: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddBarcode();
                  e.preventDefault();
                }
              }}
              className="border p-2 w-full"
              placeholder="Scan or enter barcode"
            />
            <button
              type="button"
              onClick={handleAddBarcode}
              className="bg-green-600 text-white px-4 rounded"
            >
              Add New Barcode
            </button>
          </div>
        </div>
{/* 
     
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Outlets</label>
          {(form.outlets && form.outlets.length > 0)
            ? form.outlets.map((outlet, idx) => (
                <div key={idx} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={outlet}
                    onChange={(e) => handleOutletChange(idx, e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Enter outlet"
                  />
                </div>
              ))
            : <div>No outlets entered yet</div> // Display message if no outlets
          }

          <button
            type="button"
            onClick={() => handleAddOutlet('')}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Enter New Outlet
          </button>
        </div> */}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          type="button"
          onClick={handleAddProduct}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>

        <button
          type="button"
          onClick={handleUpdateProduct}
          className={`${
            editingId ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } px-4 py-2 rounded`}
          disabled={!editingId}
        >
          Update Product
        </button>

        {editingId && (
          <button
            onClick={() => {
              setForm({
                name: '',
                slug: '',
                category_id: '',
                brand_id: '',
                description: '',
                image_url: '',
                quantity: '',
                unit_id: '',
                price: '',
                dprice: '',
                discount: ''
              });
              setEditingId(null);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        )}
      </div>
    </form>

    {/* Products List */}
    <ul className="space-y-3 border p-2">
      <h2 className="text-xl font-semibold text-center text-yellow-800 mt-4 mb-4">ALL PRODUCTS</h2>
      {products
        .filter((p) => form.name.trim() === '' || p.name.toLowerCase().includes(form.name.toLowerCase()))
        .map((p) => {
          const category = categories.find((cat) => cat.id === p.category_id);
          const brand = brands.find((br) => br.id === p.brand_id);
          const unit = units.find((u) => u.id === p.unit_id);

          return (
            <li key={p.id} className="border rounded p-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                )}
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Category: <span className="text-blue-600">{category?.name || 'Unknown'}</span> |
                    Brand: <span className="text-green-600">{brand?.name || 'Unknown'}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Quantity: <span className="text-purple-600">{p.quantity} {unit?.name || ''}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Price: ₹<span className="text-red-600">{p.dprice}</span>{' '}
                    <s className="text-gray-400">₹{p.price}</s>{' '}
                    <span className="text-green-700">({p.discount}% OFF)</span>
                  </div>
                </div>
              </div>
              <div className="space-x-2">
                <button onClick={() => handleEdit(p)} className="text-yellow-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          );
        })}
    </ul>
  </div>
</POSLayout>

  );
};

export default ProductForm;
