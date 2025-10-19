package com.kidscarpool.controller;

import com.kidscarpool.dto.RideRequest;
import com.kidscarpool.dto.RideResponse;
import com.kidscarpool.security.AuthUtil;
import com.kidscarpool.service.RideService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class RideController {
    
    @Autowired
    private RideService rideService;
    
    @Autowired
    private AuthUtil authUtil;
    
    @PostMapping
    public ResponseEntity<?> createRide(@Valid @RequestBody RideRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            RideResponse ride = rideService.createRide(request, userId);
            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/my-rides")
    public ResponseEntity<?> getUserRides() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            List<RideResponse> rides = rideService.getUserRides(userId);
            return ResponseEntity.ok(rides);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/school/{schoolId}")
    public ResponseEntity<?> getRidesBySchool(@PathVariable Long schoolId) {
        try {
            List<RideResponse> rides = rideService.getRidesBySchool(schoolId);
            return ResponseEntity.ok(rides);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/active")
    public ResponseEntity<?> getActiveRides() {
        try {
            List<RideResponse> rides = rideService.getActiveRides();
            return ResponseEntity.ok(rides);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getRide(@PathVariable Long id) {
        try {
            RideResponse ride = rideService.getRide(id);
            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRide(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            rideService.deleteRide(id, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateRideStatus(@PathVariable Long id, @PathVariable String status) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            RideResponse ride = rideService.updateRideStatus(id, status, userId);
            return ResponseEntity.ok(ride);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // Error response class
    private static class ErrorResponse {
        private String detail;
        
        public ErrorResponse(String detail) {
            this.detail = detail;
        }
        
        public String getDetail() {
            return detail;
        }
        
        public void setDetail(String detail) {
            this.detail = detail;
        }
    }
}
