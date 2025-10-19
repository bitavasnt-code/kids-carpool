package com.kidscarpool.repository;

import com.kidscarpool.model.RideLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideLocationRepository extends JpaRepository<RideLocation, Long> {
    List<RideLocation> findByRideId(Long rideId);
}
