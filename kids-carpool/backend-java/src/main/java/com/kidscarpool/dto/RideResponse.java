package com.kidscarpool.dto;

import com.kidscarpool.model.Ride;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RideResponse {
    private Long id;
    private Long user_id;
    private Long school_id;
    private String ride_date;
    private String ride_time;
    private String pickup_location;
    private String dropoff_location;
    private Integer available_seats;
    private Integer total_seats;
    private String notes;
    private String status;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    
    public static RideResponse fromRide(Ride ride) {
        RideResponse response = new RideResponse();
        response.setId(ride.getId());
        response.setUser_id(ride.getUserId());
        response.setSchool_id(ride.getSchoolId());
        response.setRide_date(ride.getRideDate());
        response.setRide_time(ride.getRideTime());
        response.setPickup_location(ride.getPickupLocation());
        response.setDropoff_location(ride.getDropoffLocation());
        response.setAvailable_seats(ride.getAvailableSeats());
        response.setTotal_seats(ride.getTotalSeats());
        response.setNotes(ride.getNotes());
        response.setStatus(ride.getStatus().name().toLowerCase());
        response.setCreated_at(ride.getCreatedAt());
        response.setUpdated_at(ride.getUpdatedAt());
        return response;
    }
}
