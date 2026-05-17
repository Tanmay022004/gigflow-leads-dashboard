import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">
          GigFlow Dashboard
        </h1>

        <p className="text-gray-600 text-lg mb-10">
          Smart Lead Management System built with
          MERN Stack and TypeScript
        </p>

        <div>
          <Link
            to="/login"
            className="bg-red-500 text-white px-10 py-4 rounded-xl mr-10 inline-block"
          >
            Login
          </Link>
        
          <Link
            to="/register"
            className="bg-blue-500 text-white px-10 py-4 rounded-xl inline-block"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;