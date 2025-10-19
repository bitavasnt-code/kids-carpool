# 🛠️ Kids Carpool - Development Guide

## 🎯 Current Status

✅ **Backend**: Fully functional with 30+ API endpoints  
✅ **Frontend**: Landing page live, ready for more pages  
✅ **Database**: SQLite with 8 tables  
✅ **Running**: Both services operational

---

## 🚀 Quick Start (Daily Development)

### Start Everything
```bash
# Terminal 1: Backend
cd ~/Coding/kids-carpool/backend
python3 main.py

# Terminal 2: Frontend
cd ~/Coding/kids-carpool/frontend
npm run dev

# Open browser
open http://localhost:5173
```

### Stop Everything
```bash
# Kill both services
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 📝 Next Features to Build

### 1. Login/Register Page (Priority 1)

**File**: `frontend/src/pages/Auth.tsx`

```typescript
// Features needed:
- Email/password input fields
- Form validation
- API call to /api/auth/register
- API call to /api/auth/login
- Store JWT token in localStorage
- Redirect to dashboard on success
```

**API Endpoints to Use:**
- `POST /api/auth/register`
- `POST /api/auth/login`

### 2. Dashboard Page (Priority 2)

**File**: `frontend/src/pages/Dashboard.tsx`

```typescript
// Features needed:
- Welcome message with user name
- Quick stats (rides, children, messages)
- Upcoming rides list
- Quick action buttons
- Navigation menu
```

**API Endpoints to Use:**
- `GET /api/auth/me`
- `GET /api/rides/my-rides`
- `GET /api/children`

### 3. Find Rides Page (Priority 3)

**File**: `frontend/src/pages/FindRides.tsx`

```typescript
// Features needed:
- Search filters (school, date, location)
- Ride cards with details
- "Request to Join" button
- Driver information
- Available seats indicator
```

**API Endpoints to Use:**
- `GET /api/rides?school_id=1`
- `POST /api/ride-requests`

### 4. My Children Page (Priority 4)

**File**: `frontend/src/pages/Children.tsx`

```typescript
// Features needed:
- List of children
- Add child form
- Edit child details
- Emergency contact info
- School assignment
```

**API Endpoints to Use:**
- `GET /api/children`
- `POST /api/children`
- `DELETE /api/children/{id}`

---

## 🎨 Component Structure

### Recommended Folder Structure
```
frontend/src/
├── pages/
│   ├── Landing.tsx          # ✅ Done
│   ├── Auth.tsx             # ⏳ To build
│   ├── Dashboard.tsx        # ⏳ To build
│   ├── FindRides.tsx        # ⏳ To build
│   ├── MyRides.tsx          # ⏳ To build
│   ├── Children.tsx         # ⏳ To build
│   ├── Messages.tsx         # ⏳ To build
│   └── Profile.tsx          # ⏳ To build
├── components/
│   ├── Navbar.tsx           # ⏳ To build
│   ├── RideCard.tsx         # ⏳ To build
│   ├── ChildCard.tsx        # ⏳ To build
│   ├── MessageThread.tsx    # ⏳ To build
│   └── Map.tsx              # ⏳ To build
├── services/
│   └── api.ts               # ⏳ To build
├── hooks/
│   └── useAuth.tsx          # ⏳ To build
├── types.ts                 # ✅ Done
├── App.tsx                  # ✅ Done
└── main.tsx                 # ✅ Done
```

---

## 🔌 API Integration Guide

### 1. Create API Service

**File**: `frontend/src/services/api.ts`

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  register: (data) => axios.post(`${API_URL}/auth/register`, data),
  login: (data) => axios.post(`${API_URL}/auth/login`, data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  getMe: () => axios.get(`${API_URL}/auth/me`, {
    headers: getAuthHeader()
  }),
  
  // Children
  getChildren: () => axios.get(`${API_URL}/children`, {
    headers: getAuthHeader()
  }),
  addChild: (data) => axios.post(`${API_URL}/children`, data, {
    headers: getAuthHeader()
  }),
  
  // Rides
  getRides: (params) => axios.get(`${API_URL}/rides`, {
    params,
    headers: getAuthHeader()
  }),
  createRide: (data) => axios.post(`${API_URL}/rides`, data, {
    headers: getAuthHeader()
  }),
  
  // Ride Requests
  requestRide: (data) => axios.post(`${API_URL}/ride-requests`, data, {
    headers: getAuthHeader()
  }),
};
```

### 2. Create Auth Hook

**File**: `frontend/src/hooks/useAuth.tsx`

```typescript
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const res = await api.login(formData);
    localStorage.setItem('token', res.data.access_token);
    const userRes = await api.getMe();
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, loading, login, logout };
};
```

---

## 🎨 UI Component Examples

### Navbar Component

```typescript
// frontend/src/components/Navbar.tsx
import { Car, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold">Kids Carpool</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-6">
              <a href="/dashboard" className="hover:text-primary-600">Dashboard</a>
              <a href="/find-rides" className="hover:text-primary-600">Find Rides</a>
              <a href="/my-rides" className="hover:text-primary-600">My Rides</a>
              <a href="/children" className="hover:text-primary-600">Children</a>
              <a href="/messages" className="hover:text-primary-600">Messages</a>
              
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>{user.full_name}</span>
              </div>
              
              <button onClick={logout} className="text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
```

### Ride Card Component

```typescript
// frontend/src/components/RideCard.tsx
import { Calendar, Clock, Users, MapPin } from 'lucide-react';

export function RideCard({ ride, onRequest }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{ride.driver?.full_name}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>⭐ {ride.driver?.average_rating.toFixed(1)}</span>
            <span>({ride.driver?.total_ratings} reviews)</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {ride.available_seats} seats
          </div>
          <div className="text-sm text-gray-600">available</div>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="h-4 w-4" />
          <span>{new Date(ride.ride_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="h-4 w-4" />
          <span>{ride.departure_time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>{ride.origin_address}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="h-4 w-4" />
          <span>{ride.destination_address}</span>
        </div>
      </div>
      
      {ride.notes && (
        <p className="text-sm text-gray-600 mb-4">{ride.notes}</p>
      )}
      
      <button
        onClick={() => onRequest(ride.id)}
        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
      >
        Request to Join
      </button>
    </div>
  );
}
```

---

## 🧪 Testing Workflow

### 1. Test Backend API
```bash
# Open API docs
open http://localhost:8000/docs

# Or use curl
curl http://localhost:8000/api/schools
```

### 2. Test Frontend
```bash
# Check console for errors
# Open browser DevTools (F12)
# Check Network tab for API calls
```

### 3. Test Full Flow
1. Register a user
2. Login
3. Add a child
4. Create a ride
5. Request to join a ride

---

## 📦 Adding New Features

### Example: Add Rating System to Frontend

1. **Create component**: `frontend/src/components/RatingStars.tsx`
2. **Add API call**: Update `api.ts` with rating endpoints
3. **Integrate**: Add to ride card or user profile
4. **Test**: Verify rating submission works

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Backend already has CORS configured for localhost:5173

### Issue: 401 Unauthorized
**Solution**: Check if JWT token is in localStorage and valid

### Issue: Database locked
**Solution**: Restart backend, SQLite doesn't handle concurrent writes well

### Issue: Port already in use
**Solution**: 
```bash
lsof -ti:8000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 📚 Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- TailwindCSS: https://tailwindcss.com/
- TypeScript: https://www.typescriptlang.org/

### Tools
- API Testing: http://localhost:8000/docs
- Database: `sqlite3 backend/kids_carpool.db`
- Browser DevTools: F12

---

## 🎯 Development Priorities

### Week 1
- [ ] Login/Register page
- [ ] Dashboard page
- [ ] Navigation bar
- [ ] API service layer

### Week 2
- [ ] Find Rides page
- [ ] My Rides page
- [ ] Ride card component
- [ ] Request system

### Week 3
- [ ] Children management
- [ ] Messaging system
- [ ] Profile page
- [ ] Settings

### Week 4
- [ ] Google Maps integration
- [ ] Real-time tracking
- [ ] Notifications
- [ ] Polish & testing

---

**Happy Coding! Build something amazing!** 🚀👨‍💻
