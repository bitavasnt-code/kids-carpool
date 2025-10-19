package com.kidscarpool.dto;

import com.kidscarpool.model.Rating;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RatingResponse {
    private Long id;
    private Long rater_id;
    private Long rated_id;
    private Long ride_id;
    private Integer rating;
    private String comment;
    private LocalDateTime created_at;
    
    public static RatingResponse fromRating(Rating rating) {
        RatingResponse response = new RatingResponse();
        response.setId(rating.getId());
        response.setRater_id(rating.getRaterId());
        response.setRated_id(rating.getRatedId());
        response.setRide_id(rating.getRideId());
        response.setRating(rating.getRating());
        response.setComment(rating.getComment());
        response.setCreated_at(rating.getCreatedAt());
        return response;
    }
}
