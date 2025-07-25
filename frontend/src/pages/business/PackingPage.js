
import React, { useState, useEffect,useRef,useMemo } from 'react';
import {
  useGetAllPurchasesQuery,
} from '../../features/inventory/purchaseSlice';
import {
  useAddPackingMutation,
  useUpdateAvailableQtyByKeyMutation,
} from '../../features/inventory/packingSlice';
import { useGetCategoriesQuery } from '../../features/inventory/categorySlice';
import { useGetBrandsQuery } from '../../features/inventory/brandSlice';
import { useGetUnitsQuery } from '../../features/inventory/unitSlice';
import { useGetProductsQuery } from '../../features/inventory/productSlice';
import POSLayout from '../../layouts/POSLayout';
import {
  useGetExpensesQuery
} from '../../features/inventory/expenseSlice';
const PackageForm = () => {
  const { data: purchases = [] , refetch: refetchPurchases} = useGetAllPurchasesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: brands = [] } = useGetBrandsQuery();
  const { data: units = [] } = useGetUnitsQuery();
  const { data: products = [] } = useGetProductsQuery();
  const { data: expenses = [] } = useGetExpensesQuery();

  const [addPacking] = useAddPackingMutation();
  const [updateAvailableQtyByKey] = useUpdateAvailableQtyByKeyMutation();
 const convertToLeast = (val, unit) => {
    if (unit === 'kg') return val * 1000;
    if (unit === 'kgs') return val * 1000;
    if (unit === 'ltr') return val * 1000;
    if (unit === 'gms') return val * 1;
        if (unit === 'qty') return val * 1;
           
    return val; // assume gms or ml
  };

  const convertFromLeast = (val, unit) => {
    if (unit === 'kg') return val / 1000;
    if (unit === 'kgs') return val / 1000;
    if (unit === 'ltr') return val / 1000;
     if (unit === 'gms') return val / 1;
         if (unit === 'qty') return val / 1;
    console.log(val)
    return val; // assume gms or ml
  };
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const perLeastPriceRef = useRef(0);
const expensePerLeastUnitRef = useRef(0);
const baseUnitRef = useRef('');
  const [formData, setFormData] = useState({
    productName: '',
    brandName: '',
    categoryName: '',
    quantity: 0,
    units: '',
    packingUnit: '',
    noOfPacks: '',
    mrp: '',
    purchasePrice: '',
    discountPercent: '',
    discountPrice: '',
    packedDate: '',
    expiryDate: '',
    availableQty: 0,
    originalAvailableQty: 0,
    purchaseKey: '',
    estimatedProfitMargin: '',
    estimatedProfitPerPack: '',
    orgProfitPerPack: '',
    outletProfitPerPack: '',
    totalEstimatedProfit: '',
    totalOrgProfit: '',
    totalOutletProfit: '',
    orgMargin: 50,
    outletMargin: 50,
  });

 useEffect(() => {
  if (selectedPurchase) {
    const product = products.find(p => p.id === selectedPurchase.productID) || {};
    const brand = brands.find(b => b.id === selectedPurchase.brandID) || {};
    const category = categories.find(c => c.id === selectedPurchase.categoryID) || {};
    const unit = units.find(u => u.id === selectedPurchase.unitsID) || {};
    const baseUnit = unit.name?.toLowerCase();
    baseUnitRef.current = baseUnit;

    const originalQtyInLeast = convertToLeast(selectedPurchase.quantity, baseUnit);
    const perLeastPrice = selectedPurchase.price / originalQtyInLeast;
    perLeastPriceRef.current = perLeastPrice;
    console.log('selectedPurchase.quantity'+selectedPurchase.quantity)
       console.log('baseUnit'+baseUnit)

    const purchaseExpenses = expenses.filter(exp =>
      Array.isArray(exp.purchaseIDs) &&
      exp.purchaseIDs.map(String).includes(String(selectedPurchase.purchaseID))
    );

    const totalExpense = purchaseExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

    const allRelatedPurchaseIDs = purchaseExpenses
      .flatMap(exp => Array.isArray(exp.purchaseIDs) ? exp.purchaseIDs : [])
      .map(id => String(id));

    const relatedPurchases = purchases.filter(p =>
      allRelatedPurchaseIDs.includes(String(p.purchaseID))
    );

    const totalPriceOfAllPurchasesInExpense = relatedPurchases.reduce(
      (sum, p) => sum + parseFloat(p.price || 0),
      0
    );

    const selectedPurchasePrice = parseFloat(selectedPurchase.price || 0);

    const totalExpenseForThisPurchase = totalPriceOfAllPurchasesInExpense > 0
      ? (selectedPurchasePrice / totalPriceOfAllPurchasesInExpense) * totalExpense
      : 0;

    const expensePerLeastUnit = totalExpenseForThisPurchase / originalQtyInLeast;
    expensePerLeastUnitRef.current = expensePerLeastUnit;

    const defaultQty = product.quantity || 0;
    const defaultQtyLeast = convertToLeast(defaultQty, baseUnit);
    // console.log("🔢 originalQtyInLeast:", originalQtyInLeast);
    // console.log("💰 perLeastPrice:", perLeastPrice);
    // console.log("📦 purchaseExpenses:", purchaseExpenses);
    // console.log("💸 totalExpense from matching expenses:", totalExpense);
    // console.log("🧾 allRelatedPurchaseIDs:", allRelatedPurchaseIDs);
    // console.log("🧮 relatedPurchases:", relatedPurchases);
    // console.log("📊 totalPriceOfAllPurchasesInExpense:", totalPriceOfAllPurchasesInExpense);
    // console.log("💼 selectedPurchasePrice:", selectedPurchasePrice);
    // console.log("⚖️ totalExpenseForThisPurchase (proportional):", totalExpenseForThisPurchase);
    // console.log("📈 expensePerLeastUnit:", expensePerLeastUnit);
    setFormData(prev => ({
      ...prev,
      productName: product.name || 'Unknown Product',
      brandName: brand.name || 'Unknown Brand',
      categoryName: category.name || 'Unknown Category',
      quantity: '',
      units: unit.name || 'Units',
      packingUnit: '', // ✅ Set packingUnit default to purchase unit
      noOfPacks: '',
      mrp: '',
      purchasePrice: ((perLeastPrice + expensePerLeastUnit) * defaultQtyLeast).toFixed(2),
      discountPercent: '',
      discountPrice: '',
      packedDate: '',
      expiryDate: '',
      availableQty: selectedPurchase.availableQuantity,
      originalAvailableQty: selectedPurchase.quantity,
      purchaseKey: selectedPurchase.key,
    }));
  }
}, [selectedPurchase, products, brands, categories, units, expenses, purchases]);






const handleChange = (e) => {
  const { name, value } = e.target;
  let updatedForm = { ...formData, [name]: value };

  const qty = parseFloat(name === 'quantity' ? value : formData.quantity);
  const packs = parseFloat(name === 'noOfPacks' ? value : formData.noOfPacks);

  const baseUnit = formData.units?.toLowerCase(); // Purchase unit
  const selectedUnit = (name === 'packingUnit' ? value : formData.packingUnit)?.toLowerCase(); // Packing unit

  const originalQtyInLeast = convertToLeast(parseFloat(selectedPurchase.availableQuantity || 0), baseUnit);
  const usedQtyInLeast = !isNaN(qty) && !isNaN(packs)
    ? convertToLeast(qty, selectedUnit) * packs
    : 0;

  const remainingQtyInLeast = originalQtyInLeast - usedQtyInLeast;
  updatedForm.availableQty = convertFromLeast(remainingQtyInLeast, baseUnit).toFixed(2);

  // 📦 Base price per least unit
  const perLeastPrice = selectedPurchase.price / convertToLeast(selectedPurchase.quantity, baseUnit);
  const currentQtyInLeast = convertToLeast(qty || 0, selectedUnit);

  // 📊 Get expense data
  const purchaseExpenses = expenses.filter(exp =>
    Array.isArray(exp.purchaseIDs) &&
    exp.purchaseIDs.map(id => String(id).trim()).includes(String(selectedPurchase.purchaseID))
  );

  const totalExpense = purchaseExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);

  const allRelatedPurchaseIDs = purchaseExpenses
    .flatMap(exp => Array.isArray(exp.purchaseIDs) ? exp.purchaseIDs : [])
    .map(id => String(id));

  const relatedPurchases = purchases.filter(p =>
    allRelatedPurchaseIDs.includes(String(p.purchaseID))
  );

  const totalPriceOfAllPurchasesInExpense = relatedPurchases.reduce(
    (sum, p) => sum + parseFloat(p.price || 0),
    0
  );

  const selectedPurchasePrice = parseFloat(selectedPurchase.price || 0);

  const totalExpenseForThisPurchase = totalPriceOfAllPurchasesInExpense > 0
    ? (selectedPurchasePrice / totalPriceOfAllPurchasesInExpense) * totalExpense
    : 0;

  const expensePerLeastUnit = totalExpenseForThisPurchase / convertToLeast(selectedPurchase.quantity, baseUnit);

  // 💰 Final purchase price for this pack
  updatedForm.purchasePrice = ((perLeastPrice + expensePerLeastUnit) * currentQtyInLeast).toFixed(2);

  // 💸 Profit margin calculations
  const mrp = parseFloat(updatedForm.mrp);
  const discountPrice = parseFloat(updatedForm.discountPrice);
  if (!isNaN(mrp) && !isNaN(discountPrice) && !isNaN(packs) && packs > 0) {
    const totalRevenue = mrp * packs;
    const totalCost = discountPrice * packs;
    updatedForm.estimatedProfitMargin = ((totalRevenue - totalCost) / totalCost * 100).toFixed(2);
  }

  if (!isNaN(mrp) && !isNaN(discountPrice)) {
    const estimatedProfitPerPack = mrp - discountPrice;
    const orgMargin = parseFloat(updatedForm.orgMargin);
    const outletMargin = 100 - orgMargin;

    updatedForm.estimatedProfitPerPack = estimatedProfitPerPack.toFixed(2);
    updatedForm.orgProfitPerPack = ((estimatedProfitPerPack * orgMargin) / 100).toFixed(2);
    updatedForm.outletProfitPerPack = ((estimatedProfitPerPack * outletMargin) / 100).toFixed(2);
  }

  const updatedpacks = parseFloat(updatedForm.noOfPacks);
  const estimatedProfitPerPack = parseFloat(updatedForm.estimatedProfitPerPack);
  const orgProfitPerPack = parseFloat(updatedForm.orgProfitPerPack);
  const outletProfitPerPack = parseFloat(updatedForm.outletProfitPerPack);

  if (!isNaN(updatedpacks) && !isNaN(estimatedProfitPerPack)) {
    updatedForm.totalEstimatedProfit = (updatedpacks * estimatedProfitPerPack).toFixed(2);
  }
  if (!isNaN(updatedpacks) && !isNaN(orgProfitPerPack)) {
    updatedForm.totalOrgProfit = (updatedpacks * orgProfitPerPack).toFixed(2);
  }
  if (!isNaN(updatedpacks) && !isNaN(outletProfitPerPack)) {
    updatedForm.totalOutletProfit = (updatedpacks * outletProfitPerPack).toFixed(2);
  }

  setFormData(updatedForm);
};


  const handleMRPChange = (e) => {
    const mrp = parseFloat(e.target.value);
    const discountPercent = parseFloat(formData.discountPercent);
    const discountPrice = (!isNaN(mrp) && !isNaN(discountPercent))
      ? (mrp - (mrp * discountPercent) / 100).toFixed(2)
      : '';

    setFormData((prev) => ({
      ...prev,
      mrp: e.target.value,
      discountPrice,
    }));
  };

  const handleDiscountChange = (e) => {
    const discountPercent = parseFloat(e.target.value);
    const mrp = parseFloat(formData.mrp);
    const discountPrice = (!isNaN(mrp) && !isNaN(discountPercent))
      ? (mrp - (mrp * discountPercent) / 100).toFixed(2)
      : '';

    setFormData((prev) => ({
      ...prev,
      discountPercent: e.target.value,
      discountPrice,
    }));
  };

  const handleDiscountPriceChange = (e) => {
    const discountPrice = parseFloat(e.target.value);
    const mrp = parseFloat(formData.mrp);
    const discountPercent = (!isNaN(mrp) && !isNaN(discountPrice))
      ? (((mrp - discountPrice) / mrp) * 100).toFixed(2)
      : '';

    setFormData((prev) => ({
      ...prev,
      discountPrice: e.target.value,
      discountPercent,
    }));
  };

  const handleDateValidation = () => {
    if (new Date(formData.packedDate) > new Date(formData.expiryDate)) {
      alert('Packed date cannot be after expiry date.');
      return false;
    }
    return true;
  };

//   const getBarcodeFromProduct = (productName, categoryID, brandID, unitID, quantity) => {
//     console.log(productName, categoryID, brandID, unitID, quantity)
// //   const product = products.find(p =>
// //     p.id === productID &&
// //     p.category_id === categoryID &&
// //     p.brand_id === brandID &&
// //     p.unit_id === unitID &&
// //     parseFloat(p.quantity) === parseFloat(quantity)
// //   );

// //   if (!product) return [];

// //   try {
// //     return JSON.parse(product.barcode);
// //   } catch (e) {
// //     return [];
// //   }
// };

const getBarcodeFromProduct = (productName, categoryID, brandID, unitID, quantity) => {
  console.log('Searching barcode for:', productName, categoryID, brandID, unitID, quantity);

  // Step 1: Match by name (case-insensitive, partial match allowed)
  const nameMatchedProducts = products.filter(p =>
    p.name.toLowerCase().includes(productName.toLowerCase())
  );

  // Step 2: Filter down by category, brand, unit, and quantity
  const matchedProduct = nameMatchedProducts.find(p =>
    p.category_id === categoryID &&
    p.brand_id === brandID &&
    p.unit_id === unitID &&
    parseFloat(p.quantity) === parseFloat(quantity)
  );

  // Step 3: Extract and return barcode if found
  if (!matchedProduct) return [];

  try {
    return JSON.parse(matchedProduct.barcode);
  } catch (err) {
    console.error('Invalid barcode format for product:', matchedProduct.name);
    return [];
  }
};
const matchingFinancials = useMemo(() => {
  if (!formData?.productName) return [];
    console.log(products
    .filter(p => p.name.toLowerCase().includes(formData.productName.toLowerCase()))
    .map(p => ({
      quantity: p.quantity,
      unitName: units.find(u => u.id === p.unit_id)?.name || '',
    })))
  return products
    .filter(p => p.name.toLowerCase().includes(formData.productName.toLowerCase()))
    .map(p => ({
      quantity: p.quantity,
      unitName: units.find(u => u.id === p.unit_id)?.name || '',
    }));
}, [products, units, formData.productName]);

const availableQuantities = useMemo(() => {
  if (!formData.packingUnit) return matchingFinancials.map(f => f.quantity);
  return matchingFinancials
    .filter(f => f.unitName === formData.packingUnit)
    .map(f => f.quantity);
}, [matchingFinancials, formData.packingUnit]);

const availableUnits = useMemo(() => {
  if (!formData.quantity) return matchingFinancials.map(f => f.unitName);
  return matchingFinancials
    .filter(f => parseFloat(f.quantity) === parseFloat(formData.quantity))
    .map(f => f.unitName);
}, [matchingFinancials, formData.quantity]);


 const handleSubmit = async (e) => {
  e.preventDefault();
  const selectedUnitObj = units.find(u => u.name === formData.packingUnit);
const unitID = selectedUnitObj ? selectedUnitObj.id : null;

if (!unitID) {
  alert("❌ Invalid packing unit selected.");
  return;
}

const barcodeArr = getBarcodeFromProduct(
  formData.productName,
  selectedPurchase.categoryID,
  selectedPurchase.brandID,
  unitID, // ✅ use from above
  parseFloat(formData.quantity)
);

  if (!handleDateValidation()) return;
    console.log(formData.packingUnit)
  const packingData = {
    purchaseID: selectedPurchase.purchaseID,
    purchaseKey: formData.purchaseKey,
    productID: selectedPurchase.productID,
    categoryID: selectedPurchase.categoryID,
    brandID: selectedPurchase.brandID,
    unitID: selectedPurchase.unitsID,
    quantity:parseFloat(formData.quantity),
    packUnits:formData.packingUnit,
    packcount: parseInt(formData.noOfPacks),
    MRP: parseFloat(formData.mrp),
    discountPercentage: parseFloat(formData.discountPercent),
    discountedPrice: parseFloat(formData.discountPrice),
    pkddt: formData.packedDate,
    expirydate: formData.expiryDate,
    status: 'packed',
    barcode: barcodeArr,
  };

  await addPacking(packingData);

  // 🧮 Convert both available and used to least unit (gms/ml)
  const usedQtyPerPack = parseFloat(formData.quantity);
  const noOfPacks = parseInt(formData.noOfPacks);
 const baseUnit = formData.units?.toLowerCase(); 
  const convertToLeast = (val, unit) => {
    if (!unit || isNaN(val)) return 0;
    unit = unit.toLowerCase();
    if (unit === 'kg' || unit === 'kgs' || unit === 'ltr') return val * 1000;
    return val; // gms, ml, qty
  };

  const convertFromLeast = (val, unit) => {
    if (!unit || isNaN(val)) return 0;
    unit = unit.toLowerCase();
    if (unit === 'kg' || unit === 'kgs' || unit === 'ltr') return val / 1000;
    return val; // gms, ml, qty
  };

  const totalUsedInLeast = convertToLeast(usedQtyPerPack, formData.packingUnit) * noOfPacks;
  const availableInLeast = convertToLeast(selectedPurchase.availableQuantity, baseUnit);
  const remainingQtyInLeastUnit = availableInLeast - totalUsedInLeast;
//   console.log(totalUsedInLeast,"sss",availableInLeast,"sss",remainingQtyInLeastUnit,"ss",baseUnit)

  // 📝 Update DB with converted unit
  await updateAvailableQtyByKey({
    key: selectedPurchase.key,
   availableQuantity: parseFloat(convertFromLeast(remainingQtyInLeastUnit, baseUnit).toFixed(2)),

  }).unwrap();

  alert('✅ Packing added & quantity updated!');
  setSelectedPurchase(null);
  setFormData({});

  if (refetchPurchases) refetchPurchases(); // re-fetch without full refresh
};


  return (
   <div className="mb-6 overflow-x-auto rounded shadow w-full">
  <POSLayout>
     <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-yellow-700">
      Package Management
    </h2>

    {/* Purchase Table */}
    <div className="mb-6 overflow-x-auto rounded shadow w-full">
        <h3 className="font-semibold mb-2 sm:mb-3 text-md sm:text-lg text-gray-700">Select a Purchase:</h3>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse bg-white">
            <thead className="bg-yellow-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-2 sm:px-4 py-2 border">Product</th>
                <th className="px-2 sm:px-4 py-2 border">Purchased Qty</th>
                <th className="px-2 sm:px-4 py-2 border">Available Qty</th>
                <th className="px-2 sm:px-4 py-2 border">Brand</th>
                <th className="px-2 sm:px-4 py-2 border">Category</th>
                <th className="px-2 sm:px-4 py-2 border">Price</th>
                <th className="px-2 sm:px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => {
                const product = products.find(prod => prod.id === p.productID) || {};
                const brand = brands.find(br => br.id === p.brandID) || {};
                const category = categories.find(cat => cat.id === p.categoryID) || {};
                const unit = units?.find(u => u.id === p.unitsID)?.name || 'Units';
                return (
                  <tr
                    key={p.purchaseID}
                    onClick={() => setSelectedPurchase(p)}
                    className="cursor-pointer hover:bg-green-50 transition-colors border-b"
                  >
                    <td className="px-2 sm:px-4 py-2">{product.name || 'Unknown'}</td>
                    <td className="px-2 sm:px-4 py-2">{p.quantity} {unit}</td>
                    <td className="px-2 sm:px-4 py-2">{p.availableQuantity} {unit}</td>
                    <td className="px-2 sm:px-4 py-2">{brand.name || 'Unknown'}</td>
                    <td className="px-2 sm:px-4 py-2">{category.name || 'Unknown'}</td>
                    <td className="px-2 sm:px-4 py-2">₹{p.price}</td>
                    <td className="px-2 sm:px-4 py-2">{p.purchaseDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    {/* Form Section */}
    {selectedPurchase && (
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-4 shadow rounded"
      >
        {[
          ["Available Quantity", `${formData.availableQty ?? ''} ${formData.units ?? ''}`, true],
          ["Product Name", formData.productName, true],
          ["Brand Name", formData.brandName, true],
          ["Category Name", formData.categoryName, true],
        ].map(([label, value, readOnly], i) => (
          <div key={i}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="text"
              value={value}
              readOnly={readOnly}
              className="w-full border p-2 bg-orange-100 rounded"
            />
          </div>
        ))}

        {/* <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full border p-2 rounded" />
        </div> */}
<div>
  <label className="block text-sm font-medium">Quantity</label>
  <select
    name="quantity"
    value={formData.quantity || ''}
    onChange={handleChange}
    className="w-full border p-2 rounded"
    required
  >
    <option value="">-- Select Quantity --</option>
    {[...new Set(availableQuantities)].map((q) => (
      <option key={q} value={q}>
        {q}
      </option>
    ))}
  </select>
</div>


        {/* <div>
          <label className="block text-sm font-medium">Packing Unit</label>
          <select name="packingUnit" value={formData.packingUnit || ''} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u.id} value={u.name}>{u.name}</option>
            ))}
          </select>
        </div> */}
        <div>
  <label className="block text-sm font-medium">Packing Unit</label>
  <select
    name="packingUnit"
    value={formData.packingUnit || ''}
    onChange={handleChange}
    className="w-full border p-2 rounded"
  >
    <option value="">-- Select Unit --</option>
    {[...new Set(availableUnits)].map((u) => (
      <option key={u} value={u}>{u}</option>
    ))}
  </select>
</div>


        {[
          ["No. of Packs", "noOfPacks"],
          ["MRP", "mrp", handleMRPChange],
          ["Purchase Price (per pack)", "purchasePrice", null, true, "bg-blue-50"],
          ["Discount %", "discountPercent", handleDiscountChange],
          ["Discount Price", "discountPrice", handleDiscountPriceChange],
          ["Packed Date", "packedDate", handleChange, false, "", "date"],
          ["Expiry Date", "expiryDate", handleChange, false, "", "date"],
          ["Estimated Profit Margin (%)", "estimatedProfitMargin", null, true, "bg-orange-100"],
          ["Organization Margin (%)", "orgMargin"],
          ["Outlet Owner Margin (%)", "outletMargin"],
          ["Profit per Pack (Estimated)", "estimatedProfitPerPack", null, true, "bg-orange-100"],
          ["Profit per Pack (Organization)", "orgProfitPerPack", null, true, "bg-orange-100"],
          ["Profit per Pack (Outlet Owner)", "outletProfitPerPack", null, true, "bg-orange-100"],
          ["Total Estimated Profit (₹)", "totalEstimatedProfit", null, true, "bg-yellow-100"],
          ["Total Org Profit (₹)", "totalOrgProfit", null, true, "bg-yellow-100"],
          ["Total Outlet Owner Profit (₹)", "totalOutletProfit", null, true, "bg-yellow-100"],
        ].map(([label, name, handler = handleChange, readOnly = false, bg = "", type = "number"], idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name] || ''}
              onChange={handler}
              readOnly={readOnly}
              className={`w-full border p-2 rounded ${bg}`}
            />
          </div>
        ))}

        <div className="sm:col-span-2 lg:col-span-3 mt-4 text-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow-md w-full sm:w-auto"
          >
            Submit Package Entry
          </button>
        </div>
      </form>
    )}
  </POSLayout>
</div>

  );
};

export default PackageForm;