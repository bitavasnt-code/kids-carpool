package com.kidscarpool.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RideRequestRequest {
    
    @NotNull(message = "Ride ID is required")
    private Long ride_id;
    
    @NotNull(message = "Child ID is required")
    private Long child_id;
    
    @NotBlank(message = "Pickup address is required")
    private String pickup_address;
}
