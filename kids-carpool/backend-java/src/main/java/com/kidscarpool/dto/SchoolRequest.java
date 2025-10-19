package com.kidscarpool.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SchoolRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Zip code is required")
    private String zip_code;
    
    private Double latitude = 0.0;
    
    private Double longitude = 0.0;
    
    @NotBlank(message = "Start time is required")
    private String start_time;
    
    @NotBlank(message = "End time is required")
    private String end_time;
}
