package com.kidscarpool.service;

import com.kidscarpool.dto.RatingRequest;
import com.kidscarpool.dto.RatingResponse;
import com.kidscarpool.model.Rating;
import com.kidscarpool.model.Ride;
import com.kidscarpool.repository.RatingRepository;
import com.kidscarpool.repository.RideRepository;
import com.kidscarpool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {
    
    @Autowired
    private RatingRepository ratingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RideRepository rideRepository;
    
    public RatingResponse createRating(RatingRequest request, Long raterId) {
        // Verify rated user exists
        userRepository.findById(request.getRated_id())
                .orElseThrow(() -> new RuntimeException("Rated user not found"));
        
        // Verify ride exists
        Ride ride = rideRepository.findById(request.getRide_id())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        // Verify rater participated in ride (simplified check)
        if (!ride.getUserId().equals(request.getRated_id()) && !ride.getUserId().equals(raterId)) {
            throw new RuntimeException("Unauthorized to rate this ride");
        }
        
        Rating rating = new Rating();
        rating.setRaterId(raterId);
        rating.setRatedId(request.getRated_id());
        rating.setRideId(request.getRide_id());
        rating.setRating(request.getRating());
        rating.setComment(request.getComment());
        
        Rating savedRating = ratingRepository.save(rating);
        
        // Update user's average rating
        updateUserAverageRating(request.getRated_id());
        
        return RatingResponse.fromRating(savedRating);
    }
    
    public List<RatingResponse> getUserRatings(Long ratedId) {
        return ratingRepository.findByRatedId(ratedId).stream()
                .map(RatingResponse::fromRating)
                .collect(Collectors.toList());
    }
    
    private void updateUserAverageRating(Long userId) {
        List<Rating> ratings = ratingRepository.findByRatedId(userId);
        if (!ratings.isEmpty()) {
            double average = ratings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);
            
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setAverageRating(average);
            user.setTotalRatings(ratings.size());
            userRepository.save(user);
        }
    }
}
