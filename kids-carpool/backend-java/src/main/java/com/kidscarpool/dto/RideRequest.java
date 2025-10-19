package com.kidscarpool.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RideRequest {
    
    @NotNull(message = "School ID is required")
    private Long school_id;
    
    @NotBlank(message = "Ride date is required")
    private String ride_date;
    
    @NotBlank(message = "Ride time is required")
    private String ride_time;
    
    @NotBlank(message = "Pickup location is required")
    private String pickup_location;
    
    @NotBlank(message = "Dropoff location is required")
    private String dropoff_location;
    
    @NotNull(message = "Available seats is required")
    private Integer available_seats;
    
    @NotNull(message = "Total seats is required")
    private Integer total_seats;
    
    private String notes;
}
