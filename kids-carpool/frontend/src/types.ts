export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: 'parent' | 'admin';
  verification_status: 'pending' | 'verified' | 'rejected';
  background_check_completed: boolean;
  average_rating: number;
  total_ratings: number;
  created_at: string;
}

export interface Child {
  id: number;
  parent_id: number;
  name: string;
  age: number;
  grade?: string;
  school_id?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_info?: string;
  special_needs?: string;
  created_at: string;
}

export interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  start_time?: string;
  end_time?: string;
  created_at: string;
}

export interface Ride {
  id: number;
  driver_id: number;
  school_id: number;
  ride_date: string;
  departure_time: string;
  origin_address: string;
  origin_lat: number;
  origin_lng: number;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  available_seats: number;
  total_seats: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  is_recurring: boolean;
  recurring_days?: string;
  cost_per_seat: number;
  notes?: string;
  created_at: string;
  driver?: User;
}

export interface RideRequest {
  id: number;
  ride_id: number;
  parent_id: number;
  child_id: number;
  pickup_address: string;
  pickup_lat: number;
  pickup_lng: number;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  picked_up_at?: string;
  dropped_off_at?: string;
  notes?: string;
  created_at: string;
  child?: Child;
  parent?: User;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface LoginCredentials {
  username: string;  // email
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}
