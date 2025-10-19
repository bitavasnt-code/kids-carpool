package com.kidscarpool.dto;

import com.kidscarpool.model.User;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String full_name;
    private String phone;
    private String role;
    private String verification_status;
    private Boolean background_check_completed;
    private Double average_rating;
    private Integer total_ratings;
    private LocalDateTime created_at;
    
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFull_name(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole().name().toLowerCase());
        response.setVerification_status(user.getVerificationStatus().name().toLowerCase());
        response.setBackground_check_completed(user.getBackgroundCheckCompleted());
        response.setAverage_rating(user.getAverageRating());
        response.setTotal_ratings(user.getTotalRatings());
        response.setCreated_at(user.getCreatedAt());
        return response;
    }
}
