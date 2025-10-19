package com.kidscarpool.repository;

import com.kidscarpool.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRatedId(Long ratedId);
    List<Rating> findByRaterId(Long raterId);
    List<Rating> findByRideId(Long rideId);
}
