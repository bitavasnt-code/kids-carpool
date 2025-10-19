package com.kidscarpool.repository;

import com.kidscarpool.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserId(Long userId);
    List<Ride> findBySchoolId(Long schoolId);
    List<Ride> findByStatus(Ride.RideStatus status);
}
