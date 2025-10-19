package com.kidscarpool.controller;

import com.kidscarpool.dto.RideRequestRequest;
import com.kidscarpool.dto.RideRequestResponse;
import com.kidscarpool.security.AuthUtil;
import com.kidscarpool.service.RideRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ride-requests")
public class RideRequestController {
    
    @Autowired
    private RideRequestService rideRequestService;
    
    @Autowired
    private AuthUtil authUtil;
    
    @PostMapping
    public ResponseEntity<?> createRideRequest(@Valid @RequestBody RideRequestRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            RideRequestResponse rideRequest = rideRequestService.createRideRequest(request, userId);
            return ResponseEntity.ok(rideRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/ride/{rideId}")
    public ResponseEntity<?> getRideRequests(@PathVariable Long rideId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            List<RideRequestResponse> requests = rideRequestService.getRideRequests(rideId, userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/my-requests")
    public ResponseEntity<?> getUserRequests() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            List<RideRequestResponse> requests = rideRequestService.getUserRequests(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> updateRequestStatus(@PathVariable Long id, @PathVariable String status) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            RideRequestResponse request = rideRequestService.updateRequestStatus(id, status, userId);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<?> cancelRequest(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            rideRequestService.cancelRequest(id, userId);
            return ResponseEntity.ok().build();
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
