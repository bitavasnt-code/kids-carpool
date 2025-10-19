import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ridesAPI, childrenAPI, rideRequestsAPI } from '../services/api';
import { Ride, Child, RideRequest } from '../types';
import { Calendar, Users, Search, Plus, Clock, MapPin } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ridesData, childrenData, requestsData] = await Promise.all([
        ridesAPI.getMyRides(),
        childrenAPI.getAll(),
        rideRequestsAPI.getMyRequests()
      ]);
      setMyRides(ridesData);
      setChildren(childrenData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600">Here's your carpool overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">My Rides</p>
                <p className="text-3xl font-bold text-primary-600">{myRides.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Children</p>
                <p className="text-3xl font-bold text-primary-600">{children.length}</p>
              </div>
              <Users className="h-10 w-10 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Requests</p>
                <p className="text-3xl font-bold text-primary-600">{requests.length}</p>
              </div>
              <Search className="h-10 w-10 text-primary-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rating</p>
                <p className="text-3xl font-bold text-primary-600">
                  {user?.average_rating.toFixed(1) || '0.0'}
                </p>
              </div>
              <div className="text-2xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/find-rides"
            className="bg-primary-600 text-white rounded-lg shadow-lg p-6 hover:bg-primary-700 transition"
          >
            <Search className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Find a Carpool</h3>
            <p className="text-primary-100">Search for rides to your school</p>
          </Link>

          <Link
            to="/my-rides"
            className="bg-white border-2 border-primary-600 text-primary-600 rounded-lg shadow-lg p-6 hover:bg-primary-50 transition"
          >
            <Plus className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Offer a Ride</h3>
            <p className="text-gray-600">Share your daily commute</p>
          </Link>

          <Link
            to="/children"
            className="bg-white border-2 border-gray-300 text-gray-700 rounded-lg shadow-lg p-6 hover:bg-gray-50 transition"
          >
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Manage Children</h3>
            <p className="text-gray-600">Add or update kids' profiles</p>
          </Link>
        </div>

        {/* Upcoming Rides */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Upcoming Rides</h2>
          </div>
          <div className="p-6">
            {myRides.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No upcoming rides</p>
                <Link
                  to="/my-rides"
                  className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Your First Ride
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myRides.slice(0, 3).map((ride) => (
                  <div key={ride.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {new Date(ride.ride_date).toLocaleDateString()} at {ride.departure_time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{ride.origin_address}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {ride.available_seats} seats left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Children Overview */}
        {children.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold">My Children</h2>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {children.map((child) => (
                  <div key={child.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-1">{child.name}</h3>
                    <p className="text-gray-600 text-sm">Age: {child.age}</p>
                    {child.grade && <p className="text-gray-600 text-sm">Grade: {child.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
