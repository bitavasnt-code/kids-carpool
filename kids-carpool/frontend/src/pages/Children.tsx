import { useEffect, useState } from 'react';
import { childrenAPI, schoolsAPI } from '../services/api';
import { Child, School } from '../types';
import { Plus, Trash2, Users, Phone, AlertCircle } from 'lucide-react';

export function Children() {
  const [children, setChildren] = useState<Child[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    school_id: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_info: '',
    special_needs: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [childrenData, schoolsData] = await Promise.all([
        childrenAPI.getAll(),
        schoolsAPI.getAll()
      ]);
      setChildren(childrenData);
      setSchools(schoolsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await childrenAPI.create({
        name: formData.name,
        age: Number(formData.age),
        grade: formData.grade || undefined,
        school_id: formData.school_id ? Number(formData.school_id) : undefined,
        emergency_contact_name: formData.emergency_contact_name || undefined,
        emergency_contact_phone: formData.emergency_contact_phone || undefined,
        medical_info: formData.medical_info || undefined,
        special_needs: formData.special_needs || undefined
      });
      
      alert('Child added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        age: '',
        grade: '',
        school_id: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_info: '',
        special_needs: ''
      });
      loadData();
    } catch (error) {
      console.error('Error adding child:', error);
      alert('Failed to add child');
    }
  };

  const handleDeleteChild = async (childId: number) => {
    if (!confirm('Are you sure you want to remove this child?')) return;
    
    try {
      await childrenAPI.delete(childId);
      setChildren(children.filter(c => c.id !== childId));
      alert('Child removed successfully');
    } catch (error) {
      console.error('Error deleting child:', error);
      alert('Failed to remove child');
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
          <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No children added yet</h3>
            <p className="text-gray-600 mb-6">Add your children to start using carpools</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
            >
              Add Your First Child
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child) => (
              <div key={child.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary-600" />
                  </div>
                  <button
                    onClick={() => handleDeleteChild(child.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Remove child"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{child.name}</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Age:</span> {child.age} years old</p>
                  {child.grade && <p><span className="font-medium">Grade:</span> {child.grade}</p>}
                  {child.school_id && (
                    <p><span className="font-medium">School:</span> {
                      schools.find(s => s.id === child.school_id)?.name || 'Unknown'
                    }</p>
                  )}
                </div>

                {(child.emergency_contact_name || child.emergency_contact_phone) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-medium">Emergency Contact</span>
                    </div>
                    {child.emergency_contact_name && (
                      <p className="text-sm text-gray-600">{child.emergency_contact_name}</p>
                    )}
                    {child.emergency_contact_phone && (
                      <p className="text-sm text-gray-600">{child.emergency_contact_phone}</p>
                    )}
                  </div>
                )}

                {(child.medical_info || child.special_needs) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-orange-600 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Important Notes</span>
                    </div>
                    {child.medical_info && (
                      <p className="text-sm text-gray-600 mb-1">Medical: {child.medical_info}</p>
                    )}
                    {child.special_needs && (
                      <p className="text-sm text-gray-600">Special needs: {child.special_needs}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-2xl font-bold mb-6">Add Child</h3>
            
            <form onSubmit={handleAddChild} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Child's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade
                  </label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 3rd, 4th"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School
                  </label>
                  <select
                    value={formData.school_id}
                    onChange={(e) => setFormData({...formData, school_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select school</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium text-gray-900 mb-4">Emergency Contact</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="555-1234"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Information
                </label>
                <textarea
                  value={formData.medical_info}
                  onChange={(e) => setFormData({...formData, medical_info: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Allergies, medications, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Needs
                </label>
                <textarea
                  value={formData.special_needs}
                  onChange={(e) => setFormData({...formData, special_needs: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Any special requirements or considerations"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Add Child
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
