import { Link, useNavigate } from 'react-router-dom';
import { Car, User, LogOut, Home, Search, Calendar, Users, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
            <Car className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Kids Carpool</h1>
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <Home className="h-5 w-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link to="/find-rides" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <Search className="h-5 w-5" />
                  <span className="hidden md:inline">Find Rides</span>
                </Link>
                <Link to="/my-rides" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <Calendar className="h-5 w-5" />
                  <span className="hidden md:inline">My Rides</span>
                </Link>
                <Link to="/children" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <Users className="h-5 w-5" />
                  <span className="hidden md:inline">Children</span>
                </Link>
                <Link to="/messages" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <MessageCircle className="h-5 w-5" />
                  <span className="hidden md:inline">Messages</span>
                </Link>

                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 hidden md:inline">{user.full_name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
