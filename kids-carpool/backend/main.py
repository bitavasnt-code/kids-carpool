from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List

import models
import schemas
import auth
from database import engine, get_db, init_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kids Carpool API",
    description="API for school carpooling platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
def root():
    return {
        "message": "Kids Carpool API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Authentication Endpoints
@app.post("/api/auth/register", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = auth.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name,
        phone=user.phone
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and get access token"""
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserProfile)
def get_current_user_profile(
    current_user: models.User = Depends(auth.get_current_active_user)
):
    """Get current user profile"""
    return current_user

# User Endpoints
@app.get("/api/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Children Endpoints
@app.post("/api/children", response_model=schemas.Child, status_code=status.HTTP_201_CREATED)
def create_child(
    child: schemas.ChildCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Add a child to current user's profile"""
    db_child = models.Child(**child.dict(), parent_id=current_user.id)
    db.add(db_child)
    db.commit()
    db.refresh(db_child)
    return db_child

@app.get("/api/children", response_model=List[schemas.Child])
def get_my_children(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's children"""
    return db.query(models.Child).filter(models.Child.parent_id == current_user.id).all()

@app.delete("/api/children/{child_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_child(
    child_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a child"""
    child = db.query(models.Child).filter(
        models.Child.id == child_id,
        models.Child.parent_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(status_code=404, detail="Child not found")
    
    db.delete(child)
    db.commit()
    return None

# School Endpoints
@app.get("/api/schools", response_model=List[schemas.School])
def get_schools(db: Session = Depends(get_db)):
    """Get all schools"""
    return db.query(models.School).all()

@app.get("/api/schools/{school_id}", response_model=schemas.School)
def get_school(school_id: int, db: Session = Depends(get_db)):
    """Get school by ID"""
    school = db.query(models.School).filter(models.School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@app.post("/api/schools", response_model=schemas.School, status_code=status.HTTP_201_CREATED)
def create_school(
    school: schemas.SchoolCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new school (admin only for now)"""
    db_school = models.School(**school.dict())
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return db_school

# Ride Endpoints
@app.post("/api/rides", response_model=schemas.Ride, status_code=status.HTTP_201_CREATED)
def create_ride(
    ride: schemas.RideCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new ride offer"""
    db_ride = models.Ride(**ride.dict(), driver_id=current_user.id)
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    return db_ride

@app.get("/api/rides", response_model=List[schemas.RideWithDriver])
def get_rides(
    school_id: int = None,
    status: models.RideStatus = None,
    db: Session = Depends(get_db)
):
    """Get available rides"""
    query = db.query(models.Ride)
    
    if school_id:
        query = query.filter(models.Ride.school_id == school_id)
    if status:
        query = query.filter(models.Ride.status == status)
    
    return query.all()

@app.get("/api/rides/my-rides", response_model=List[schemas.Ride])
def get_my_rides(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's offered rides"""
    return db.query(models.Ride).filter(models.Ride.driver_id == current_user.id).all()

@app.get("/api/rides/{ride_id}", response_model=schemas.RideWithDriver)
def get_ride(ride_id: int, db: Session = Depends(get_db)):
    """Get ride by ID"""
    ride = db.query(models.Ride).filter(models.Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    return ride

@app.delete("/api/rides/{ride_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ride(
    ride_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a ride"""
    ride = db.query(models.Ride).filter(
        models.Ride.id == ride_id,
        models.Ride.driver_id == current_user.id
    ).first()
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    db.delete(ride)
    db.commit()
    return None

# Ride Request Endpoints
@app.post("/api/ride-requests", response_model=schemas.RideRequest, status_code=status.HTTP_201_CREATED)
def create_ride_request(
    request: schemas.RideRequestCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Request to join a ride"""
    # Check if ride exists and has available seats
    ride = db.query(models.Ride).filter(models.Ride.id == request.ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if ride.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No available seats")
    
    # Create request
    db_request = models.RideRequest(**request.dict(), parent_id=current_user.id)
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    return db_request

@app.get("/api/ride-requests/my-requests", response_model=List[schemas.RideRequestWithDetails])
def get_my_ride_requests(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's ride requests"""
    return db.query(models.RideRequest).filter(
        models.RideRequest.parent_id == current_user.id
    ).all()

@app.get("/api/rides/{ride_id}/requests", response_model=List[schemas.RideRequestWithDetails])
def get_ride_requests(
    ride_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get requests for a specific ride (driver only)"""
    # Verify user is the driver
    ride = db.query(models.Ride).filter(
        models.Ride.id == ride_id,
        models.Ride.driver_id == current_user.id
    ).first()
    
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found or unauthorized")
    
    return db.query(models.RideRequest).filter(
        models.RideRequest.ride_id == ride_id
    ).all()

@app.put("/api/ride-requests/{request_id}/accept", response_model=schemas.RideRequest)
def accept_ride_request(
    request_id: int,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Accept a ride request (driver only)"""
    request = db.query(models.RideRequest).filter(
        models.RideRequest.id == request_id
    ).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Verify user is the driver
    ride = db.query(models.Ride).filter(
        models.Ride.id == request.ride_id,
        models.Ride.driver_id == current_user.id
    ).first()
    
    if not ride:
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    if ride.available_seats <= 0:
        raise HTTPException(status_code=400, detail="No available seats")
    
    # Accept request
    request.status = models.RequestStatus.ACCEPTED
    ride.available_seats -= 1
    
    db.commit()
    db.refresh(request)
    
    return request

# Message Endpoints
@app.post("/api/messages", response_model=schemas.Message, status_code=status.HTTP_201_CREATED)
def send_message(
    message: schemas.MessageCreate,
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message"""
    db_message = models.Message(**message.dict(), sender_id=current_user.id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@app.get("/api/messages", response_model=List[schemas.MessageWithUsers])
def get_messages(
    current_user: models.User = Depends(auth.get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's messages"""
    return db.query(models.Message).filter(
        (models.Message.sender_id == current_user.id) |
        (models.Message.receiver_id == current_user.id)
    ).order_by(models.Message.created_at.desc()).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
