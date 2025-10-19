package com.kidscarpool.service;

import com.kidscarpool.dto.RideRequest;
import com.kidscarpool.dto.RideResponse;
import com.kidscarpool.model.Ride;
import com.kidscarpool.repository.RideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideService {
    
    @Autowired
    private RideRepository rideRepository;
    
    public RideResponse createRide(RideRequest request, Long userId) {
        Ride ride = new Ride();
        ride.setUserId(userId);
        ride.setSchoolId(request.getSchool_id());
        ride.setRideDate(request.getRide_date());
        ride.setRideTime(request.getRide_time());
        ride.setPickupLocation(request.getPickup_location());
        ride.setDropoffLocation(request.getDropoff_location());
        ride.setAvailableSeats(request.getAvailable_seats());
        ride.setTotalSeats(request.getTotal_seats());
        ride.setNotes(request.getNotes());
        ride.setStatus(Ride.RideStatus.ACTIVE);
        
        Ride savedRide = rideRepository.save(ride);
        return RideResponse.fromRide(savedRide);
    }
    
    public List<RideResponse> getUserRides(Long userId) {
        return rideRepository.findByUserId(userId).stream()
                .map(RideResponse::fromRide)
                .collect(Collectors.toList());
    }
    
    public List<RideResponse> getRidesBySchool(Long schoolId) {
        return rideRepository.findBySchoolId(schoolId).stream()
                .map(RideResponse::fromRide)
                .collect(Collectors.toList());
    }
    
    public List<RideResponse> getActiveRides() {
        return rideRepository.findByStatus(Ride.RideStatus.ACTIVE).stream()
                .map(RideResponse::fromRide)
                .collect(Collectors.toList());
    }
    
    public RideResponse getRide(Long id) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return RideResponse.fromRide(ride);
    }
    
    public void deleteRide(Long id, Long userId) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (!ride.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to ride");
        }
        
        rideRepository.delete(ride);
    }
    
    public RideResponse updateRideStatus(Long id, String status, Long userId) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (!ride.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to ride");
        }
        
        try {
            Ride.RideStatus newStatus = Ride.RideStatus.valueOf(status.toUpperCase());
            ride.setStatus(newStatus);
            Ride updatedRide = rideRepository.save(ride);
            return RideResponse.fromRide(updatedRide);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
    }
}
