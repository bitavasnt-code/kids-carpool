import { Link } from 'react-router-dom';
import { Car, Users, Shield, MessageCircle } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Safe School Carpooling<br />Made Easy
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with trusted parents in your community for safe, reliable school transportation.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/find-rides" className="px-8 py-4 bg-primary-600 text-white text-lg rounded-lg hover:bg-primary-700 shadow-lg">
              Find a Carpool
            </Link>
            <Link to="/my-rides" className="px-8 py-4 bg-white text-primary-600 text-lg rounded-lg hover:bg-gray-50 shadow-lg border-2 border-primary-600">
              Offer a Ride
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Safety First</h3>
            <p className="text-gray-600">
              Verified parents, background checks, and real-time tracking for peace of mind.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Trust</h3>
            <p className="text-gray-600">
              Connect with parents from your school. Rate and review to build trust.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Communication</h3>
            <p className="text-gray-600">
              In-app messaging and notifications keep everyone informed.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-bold mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">Create your profile and add your children</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-bold mb-2">Find Matches</h4>
              <p className="text-gray-600 text-sm">Search for carpools going your route</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-bold mb-2">Connect</h4>
              <p className="text-gray-600 text-sm">Request to join or offer your own ride</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-bold mb-2">Track & Go</h4>
              <p className="text-gray-600 text-sm">Real-time tracking and safe transportation</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
            <div className="text-gray-600">Verified Parents</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">Safe</div>
            <div className="text-gray-600">Background Checks</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="h-6 w-6" />
            <span className="text-xl font-bold">Kids Carpool</span>
          </div>
          <p className="text-gray-400">Safe, reliable school transportation for your community</p>
          <p className="text-gray-500 text-sm mt-4">© 2025 Kids Carpool. Built with ❤️ for safer commutes.</p>
        </div>
      </footer>
    </div>
  );
}
