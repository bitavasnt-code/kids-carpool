import { useEffect, useState } from 'react';
import { ridesAPI, schoolsAPI, rideRequestsAPI } from '../services/api';
import { Ride, School, RideRequest } from '../types';
import { Plus, Calendar, Clock, MapPin, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';

export function MyRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [formData, setFormData] = useState({
    school_id: '',
    ride_date: '',
    departure_time: '',
    origin_address: '',
    destination_address: '',
    total_seats: '3',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ridesData, schoolsData] = await Promise.all([
        ridesAPI.getMyRides(),
        schoolsAPI.getAll()
      ]);
      setRides(ridesData);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async (rideId: number) => {
    try {
      const requestsData = await rideRequestsAPI.getRideRequests(rideId);
      setRequests(requestsData);
      setSelectedRide(rides.find(r => r.id === rideId) || null);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  };

  const handleCreateRide = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await ridesAPI.create({
        school_id: Number(formData.school_id),
        ride_date: new Date(formData.ride_date).toISOString(),
        departure_time: formData.departure_time,
        origin_address: formData.origin_address,
        origin_lat: 0,
        origin_lng: 0,
        destination_address: formData.destination_address,
        destination_lat: 0,
        destination_lng: 0,
        total_seats: Number(formData.total_seats),
        available_seats: Number(formData.total_seats),
        is_recurring: false,
        notes: formData.notes
      });
      
      alert('Ride created successfully!');
      setShowCreateModal(false);
      setFormData({
        school_id: '',
        ride_date: '',
        departure_time: '',
        origin_address: '',
        destination_address: '',
        total_seats: '3',
        notes: ''
      });
      loadData();
    } catch (error) {
      console.error('Error creating ride:', error);
      alert('Failed to create ride');
    }
  };

  const handleDeleteRide = async (rideId: number) => {
    if (!confirm('Are you sure you want to delete this ride?')) return;
    
    try {
      await ridesAPI.delete(rideId);
      setRides(rides.filter(r => r.id !== rideId));
      alert('Ride deleted successfully');
    } catch (error) {
      console.error('Error deleting ride:', error);
      alert('Failed to delete ride');
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await rideRequestsAPI.accept(requestId);
      alert('Request accepted!');
      if (selectedRide) {
        loadRequests(selectedRide.id);
      }
      loadData();
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Failed to accept request');
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Rides</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Ride
          </button>
        </div>

        {rides.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-600 mb-6">Create your first carpool ride to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Create Your First Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="font-bold text-lg">
                        {new Date(ride.ride_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{ride.departure_time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600">{ride.available_seats}</div>
                      <div className="text-sm text-gray-600">of {ride.total_seats} seats</div>
                    </div>
                    <button
                      onClick={() => handleDeleteRide(ride.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                      title="Delete ride"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{ride.origin_address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{ride.destination_address}</span>
                  </div>
                </div>

                {ride.notes && (
                  <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                    {ride.notes}
                  </p>
                )}

                <button
                  onClick={() => loadRequests(ride.id)}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2"
                >
                  <Users className="h-5 w-5" />
                  View Requests
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Ride Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold mb-6">Create New Ride</h3>
            
            <form onSubmit={handleCreateRide} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School *
                  </label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({...formData, school_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select school</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.ride_date}
                    onChange={(e) => setFormData({...formData, ride_date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Time *
                  </label>
                  <input
                    type="time"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Seats *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={formData.total_seats}
                    onChange={(e) => setFormData({...formData, total_seats: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location *
                </label>
                <input
                  type="text"
                  value={formData.origin_address}
                  onChange={(e) => setFormData({...formData, origin_address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Drop-off Location *
                </label>
                <input
                  type="text"
                  value={formData.destination_address}
                  onChange={(e) => setFormData({...formData, destination_address: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="School address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any additional information..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Create Ride
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Requests Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Ride Requests</h3>
            
            {requests.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No requests yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold">{request.parent?.full_name}</h4>
                        <p className="text-sm text-gray-600">Child: {request.child?.name}</p>
                        <p className="text-sm text-gray-600">Pickup: {request.pickup_address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        request.status === 'declined' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setSelectedRide(null)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
