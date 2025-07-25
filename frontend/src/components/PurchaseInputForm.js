import React, { useState, useEffect } from 'react';

const PurchaseInputForm = ({ onSubmit, onCancel, products, categories, brands, units }) => {
  const [formData, setFormData] = useState({
    categoryID: '',
    brandID: '',
    productID: '',
    quantity: '',
    price: '',
    GST: '',
    unitID: '',
    status: 'unapproved',
    requirePacking: 'NO',
    key: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);  // Success message state

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3) {
      const filteredProducts = products.filter((product) =>
        product.name && product.name.toLowerCase().includes(term.toLowerCase())
      );

      const enrichedProducts = filteredProducts.map((product) => {
        const category = categories.find((cat) => cat.id === product.category_id);
        const brand = brands.find((br) => br.id === product.brand_id);
        const unit = units.find((u) => u.id === product.unit_id);

        return {
          ...product,
          categoryName: category ? category.name : 'Unknown Category',
          brandName: brand ? brand.name : 'Unknown Brand',
          unitName: unit ? unit.name : 'Unknown Unit',

        };
      });

      setSuggestions(enrichedProducts);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (product) => {
    const dateTime = new Date().toISOString();
    const key = `${product.category_id}-${product.brand_id}-${product.id}-${formData.quantity || '0'}-${dateTime}`;
    setFormData({
      ...formData,
      categoryID: product.category_id,
      brandID: product.brand_id,
      productID: product.id,
      quantity: product.quantity || '',
      price: product.price || '',
      GST: product.GST || '',
      unitID: product.unit_id || '',
      requirePacking: 'NO',
      key: key,
    });

    setSearchTerm(product.name);
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    // e.preventDefault(); // Prevent default form submission

    onSubmit(formData);
    setIsSuccess(true); // Show success message
  };

  // Reset success message after 3 seconds
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);  // Hide success message after 3 seconds
      }, 10000);

      return () => clearTimeout(timer);  // Clean up the timer if the component unmounts
    }
  }, [isSuccess]);

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Create New Purchase</h2>

      {isSuccess && (
        <div className="text-green-600 text-center mb-4">
          <p>Purchase request sent successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Search Product</label>
          <input
            type="text"
            name="productID"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a product"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded-md max-h-60 overflow-y-auto">
              {suggestions.map((product) => (
                <li
                  key={product.productID}
                  onClick={() => handleSuggestionClick(product)}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-4">
                    {product.image_url && (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.categoryName}</div>
                      <div className="text-sm text-gray-600">{product.brandName}</div>
                      <div className="text-xs text-gray-500">Price: ₹{product.price}</div>
                      <div className="text-sm text-gray-600">{product.quantity}{product.unitName}</div>
                      
                      <div className="text-xs text-gray-500">
                        DPrice: ₹{product.dprice} <span className="text-green-600">({product.discount}% OFF)</span>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            name="categoryID"
            value={formData.categoryID}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Brand</label>
          <select
            name="brandID"
            value={formData.brandID}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Brand</option>
            {brands?.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Unit</label>
          <select
            name="unitID"
            value={formData.unitID}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="">Select Unit</option>
            {units?.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Require Packing</label>
          <select
            name="requirePacking"
            value={formData.requirePacking}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">GST</label>
          <input
            type="number"
            name="GST"
            value={formData.GST}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Add Purchase
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PurchaseInputForm;
