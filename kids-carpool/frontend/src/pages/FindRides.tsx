import { useEffect, useState } from 'react';
import { ridesAPI, schoolsAPI, childrenAPI, rideRequestsAPI } from '../services/api';
import { Ride, School, Child } from '../types';
import { Search, Calendar, Clock, MapPin, User, Star } from 'lucide-react';

export function FindRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ridesData, schoolsData, childrenData] = await Promise.all([
        ridesAPI.getAll(),
        schoolsAPI.getAll(),
        childrenAPI.getAll()
      ]);
      setRides(ridesData);
      setSchools(schoolsData);
      setChildren(childrenData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = selectedSchool ? { school_id: selectedSchool } : {};
      const ridesData = await ridesAPI.getAll(params);
      setRides(ridesData);
    } catch (error) {
      console.error('Error searching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = (ride: Ride) => {
    if (children.length === 0) {
      alert('Please add a child to your profile first!');
      return;
    }
    setSelectedRide(ride);
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    if (!selectedRide || !selectedChild || !pickupAddress) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await rideRequestsAPI.create({
        ride_id: selectedRide.id,
        child_id: selectedChild,
        pickup_address: pickupAddress,
        pickup_lat: 0, // In real app, use geocoding
        pickup_lng: 0
      });
      alert('Request sent successfully!');
      setShowRequestModal(false);
      setPickupAddress('');
      setSelectedChild(null);
    } catch (error) {
      console.error('Error requesting ride:', error);
      alert('Failed to send request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Carpools</h1>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School
              </label>
              <select
                value={selectedSchool || ''}
                onChange={(e) => setSelectedSchool(e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Schools</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSearch}
                className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {rides.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </div>
          ) : (
            rides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{ride.driver?.full_name || 'Driver'}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{ride.driver?.average_rating.toFixed(1) || '0.0'}</span>
                        <span>({ride.driver?.total_ratings || 0} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{ride.available_seats}</div>
                    <div className="text-sm text-gray-600">seats left</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(ride.ride_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="h-4 w-4" />
                      <span>{ride.departure_time}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{ride.origin_address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{ride.destination_address}</span>
                    </div>
                  </div>
                </div>

                {ride.notes && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {ride.notes}
                  </p>
                )}

                <button
                  onClick={() => handleRequestRide(ride)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 font-medium"
                >
                  Request to Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Request to Join Ride</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Child
                </label>
                <select
                  value={selectedChild || ''}
                  onChange={(e) => setSelectedChild(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Choose a child</option>
                  {children.map((child) => (
                    <option key={child.id} value={child.id}>
                      {child.name} (Age {child.age})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Address
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
