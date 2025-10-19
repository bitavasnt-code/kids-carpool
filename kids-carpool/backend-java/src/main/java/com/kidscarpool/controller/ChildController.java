package com.kidscarpool.controller;

import com.kidscarpool.dto.ChildRequest;
import com.kidscarpool.dto.ChildResponse;
import com.kidscarpool.security.AuthUtil;
import com.kidscarpool.service.ChildService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
public class ChildController {
    
    @Autowired
    private ChildService childService;
    
    @Autowired
    private AuthUtil authUtil;
    
    @PostMapping
    public ResponseEntity<?> createChild(@Valid @RequestBody ChildRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            ChildResponse child = childService.createChild(request, userId);
            return ResponseEntity.ok(child);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserChildren() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            List<ChildResponse> children = childService.getUserChildren(userId);
            return ResponseEntity.ok(children);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getChild(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            ChildResponse child = childService.getChild(id, userId);
            return ResponseEntity.ok(child);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChild(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            childService.deleteChild(id, userId);
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
