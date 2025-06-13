// src/pages/Login.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginPosUser } from '../features/auth/posUserSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo, loading, error } = useSelector((state) => state.posUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginPosUser({ username, password }));
  };

 useEffect(() => {
  if (userInfo?.token) {
    const role = userInfo.role;

    if (role === 'ADMIN') navigate('/dashboard');
    else if (role === 'INVENTORY') navigate('/inventory');
    else if (role === 'CASHIER' || role === 'ONLINE_CASHIER' || role === 'HYBRID_CASHIER') navigate('/pos');
    else if (role === 'PACKING_AGENT') navigate('/packing');
      else if (role === 'DISPATCH_AGENT') navigate('/dispatch');
        else if (role === 'DELIVERY_AGENT') navigate('/delivery');
    else navigate('/login'); // fallback
  }
}, [userInfo, navigate]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">🔐 Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
