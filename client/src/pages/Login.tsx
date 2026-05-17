import { useState } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      setAuth(res.data.token, res.data.user);

      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-black text-white w-full p-3 rounded-lg">
          Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-blue-600"
          >
            Register
          </a>
        </p>

      </form>
    </div>
  );
};

export default Login;