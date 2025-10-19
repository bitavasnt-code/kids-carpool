package com.kidscarpool.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChildRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;
    
    private String grade;
    
    private Long school_id;
    
    private String emergency_contact_name;
    
    private String emergency_contact_phone;
    
    private String medical_info;
    
    private String special_needs;
}
