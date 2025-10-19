from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from models import UserRole, VerificationStatus, RideStatus, RequestStatus

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: UserRole
    verification_status: VerificationStatus
    background_check_completed: bool
    average_rating: float
    total_ratings: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProfile(User):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    profile_photo_url: Optional[str] = None

# Child Schemas
class ChildBase(BaseModel):
    name: str
    age: int
    grade: Optional[str] = None
    school_id: Optional[int] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    medical_info: Optional[str] = None
    special_needs: Optional[str] = None

class ChildCreate(ChildBase):
    pass

class Child(ChildBase):
    id: int
    parent_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# School Schemas
class SchoolBase(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    latitude: float
    longitude: float

class SchoolCreate(SchoolBase):
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None

class School(SchoolBase):
    id: int
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Ride Schemas
class RideBase(BaseModel):
    school_id: int
    ride_date: datetime
    departure_time: str
    origin_address: str
    origin_lat: float
    origin_lng: float
    destination_address: str
    destination_lat: float
    destination_lng: float
    available_seats: int
    total_seats: int
    is_recurring: bool = False
    recurring_days: Optional[str] = None
    cost_per_seat: float = 0.0
    notes: Optional[str] = None

class RideCreate(RideBase):
    pass

class Ride(RideBase):
    id: int
    driver_id: int
    status: RideStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class RideWithDriver(Ride):
    driver: User

# Ride Request Schemas
class RideRequestBase(BaseModel):
    ride_id: int
    child_id: int
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    notes: Optional[str] = None

class RideRequestCreate(RideRequestBase):
    pass

class RideRequest(RideRequestBase):
    id: int
    parent_id: int
    status: RequestStatus
    picked_up_at: Optional[datetime] = None
    dropped_off_at: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class RideRequestWithDetails(RideRequest):
    child: Child
    parent: User

# Message Schemas
class MessageBase(BaseModel):
    receiver_id: int
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    sender_id: int
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageWithUsers(Message):
    sender: User
    receiver: User

# Rating Schemas
class RatingBase(BaseModel):
    ride_id: int
    rated_user_id: int
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = None

class RatingCreate(RatingBase):
    pass

class Rating(RatingBase):
    id: int
    rater_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Location Update (for real-time tracking)
class LocationUpdate(BaseModel):
    ride_id: int
    latitude: float
    longitude: float

# Search/Filter Schemas
class RideSearch(BaseModel):
    school_id: Optional[int] = None
    date: Optional[datetime] = None
    origin_lat: Optional[float] = None
    origin_lng: Optional[float] = None
    max_distance_km: Optional[float] = 5.0

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
