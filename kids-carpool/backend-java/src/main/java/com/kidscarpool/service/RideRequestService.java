package com.kidscarpool.service;

import com.kidscarpool.dto.RideRequestRequest;
import com.kidscarpool.dto.RideRequestResponse;
import com.kidscarpool.model.Ride;
import com.kidscarpool.model.RideRequest;
import com.kidscarpool.repository.RideRepository;
import com.kidscarpool.repository.RideRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import java.util.stream.Collectors;

@Service
public class RideRequestService {
    
    @Autowired
    private RideRequestRepository rideRequestRepository;
    
    @Autowired
    private RideRepository rideRepository;
    
    public RideRequestResponse createRideRequest(RideRequestRequest request, Long userId) {
        // Verify ride exists
        Ride ride = rideRepository.findById(request.getRide_id())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        // Check if seats are available
        if (ride.getAvailableSeats() <= 0) {
            throw new RuntimeException("No seats available");
        }
        
        RideRequest rideRequest = new RideRequest();
        rideRequest.setRideId(request.getRide_id());
        rideRequest.setRequesterId(userId);
        rideRequest.setChildId(request.getChild_id());
        rideRequest.setPickupAddress(request.getPickup_address());
        rideRequest.setStatus(RideRequest.RequestStatus.PENDING);
        
        RideRequest savedRequest = rideRequestRepository.save(rideRequest);
        return RideRequestResponse.fromRideRequest(savedRequest);
    }
    
    public List<RideRequestResponse> getRideRequests(Long rideId, Long userId) {
        // Verify user owns the ride
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (!ride.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to ride requests");
        }
        
        return rideRequestRepository.findByRideId(rideId).stream()
                .map(RideRequestResponse::fromRideRequest)
                .collect(Collectors.toList());
    }
    
    public List<RideRequestResponse> getUserRequests(Long userId) {
        return rideRequestRepository.findByRequesterId(userId).stream()
                .map(RideRequestResponse::fromRideRequest)
                .collect(Collectors.toList());
    }
    
    public RideRequestResponse updateRequestStatus(Long requestId, String status, Long userId) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));
        
        // Verify user owns the ride
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        if (!ride.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to ride request");
        }
        
        try {
            RideRequest.RequestStatus newStatus = RideRequest.RequestStatus.valueOf(status.toUpperCase());
            request.setStatus(newStatus);
            
            // If accepted, decrease available seats
            if (newStatus == RideRequest.RequestStatus.ACCEPTED) {
                if (ride.getAvailableSeats() > 0) {
                    ride.setAvailableSeats(ride.getAvailableSeats() - 1);
                    rideRepository.save(ride);
                } else {
                    throw new RuntimeException("No seats available");
                }
            }
            
            RideRequest updatedRequest = rideRequestRepository.save(request);
            return RideRequestResponse.fromRideRequest(updatedRequest);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status value");
        }
    }
    
    public void cancelRequest(Long requestId, Long userId) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));
        
        if (!request.getRequesterId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to ride request");
        }
        
        request.setStatus(RideRequest.RequestStatus.CANCELLED);
        rideRequestRepository.save(request);
    }
}
