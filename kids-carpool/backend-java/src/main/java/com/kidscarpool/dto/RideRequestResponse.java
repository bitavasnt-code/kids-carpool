package com.kidscarpool.dto;

import com.kidscarpool.model.RideRequest;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RideRequestResponse {
    private Long id;
    private Long ride_id;
    private Long requester_id;
    private Long child_id;
    private String pickup_address;
    private String status;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    
    public static RideRequestResponse fromRideRequest(RideRequest request) {
        RideRequestResponse response = new RideRequestResponse();
        response.setId(request.getId());
        response.setRide_id(request.getRideId());
        response.setRequester_id(request.getRequesterId());
        response.setChild_id(request.getChildId());
        response.setPickup_address(request.getPickupAddress());
        response.setStatus(request.getStatus().name().toLowerCase());
        response.setCreated_at(request.getCreatedAt());
        response.setUpdated_at(request.getUpdatedAt());
        return response;
    }
}
