import { useSelector, useDispatch } from "react-redux"; 
import { logout } from "../features/auth/posUserSlice"; 
import logo from '../assests/ManaKiranaLogo1024x1024.png';  // Adjust based on file location


function HeaderPOS() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.posUser.userInfo?.role);
  const name = useSelector((state) => state.posUser.userInfo?.username);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("posUserInfo");
    window.location.href = "/login";
  };

  return (
    <header className="bg-gray-200 text-red-800 p-1 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <img
          src={logo}
          alt="ManaKirana Logo"
          className="mx-4 h-12 w-12 rounded-full shadow-sm"
        />
        <h1 className="text-xl font-bold">
          {process.env.REACT_APP_SHOP_NAME} POS
        </h1>
      </div>

      <nav className="flex items-center space-x-6 px-4 text-sm">
        {role === 'ADMIN' && (
          <a href="/admin" className="hover:underline font-semibold">
            Admin
          </a>
        )}

        {(role === 'INVENTORY' || role === 'ADMIN') && (
          <a href="/inventory" className="hover:underline font-semibold">
            Inventory
          </a>
        )}

        <span className="text-red-800 font-medium">Hi {name}</span>

        <button
          onClick={handleLogout}
          className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-100 transition"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}

export default HeaderPOS;
