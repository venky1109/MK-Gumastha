import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
// import { logout } from "../features/auth/posUserSlice";  
import logo from "../assests/ManaKiranaLogo1024x1024.png";

function HeaderPOS({ onSidebarToggle }) {
  // const dispatch = useDispatch();
  // // const role = useSelector((state) => state.posUser.userInfo?.role);
  const name = useSelector((state) => state.posUser.userInfo?.username);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   localStorage.removeItem("posUserInfo");
  //   window.location.href = "/login";
  // };

  return (
    <header className="bg-gray-200 text-red-800 p-3 shadow-md w-full">
      <div className="flex justify-between items-center">
        {/* Logo and Shop Name */}
        <div className="flex items-center space-x-3">
          <Link to="/dashboard">
  <img
    src={logo}
    alt="ManaKirana Logo"
    className="h-10 w-10 rounded-full object-cover cursor-pointer"
  />
</Link>

          <h1 className="text-lg md:text-xl font-bold">
            {process.env.REACT_APP_SHOP_NAME || "ManaKirana"} POS
          </h1>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center space-x-4">
          {/* Desktop only */}
          <span className="hidden md:inline-block font-medium">Hi {name}</span>
          {/* <button
            onClick={handleLogout}
            className="hidden md:inline-block bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button> */}

          {/* Hamburger for mobile (to toggle sidebar) */}
          <button
            className="md:hidden text-2xl focus:outline-none"
            onClick={onSidebarToggle}
            aria-label="Toggle Sidebar"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderPOS;
