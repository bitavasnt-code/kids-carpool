package com.kidscarpool.controller;

import com.kidscarpool.dto.SchoolRequest;
import com.kidscarpool.dto.SchoolResponse;
import com.kidscarpool.service.SchoolService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {
    
    @Autowired
    private SchoolService schoolService;
    
    @PostMapping
    public ResponseEntity<?> createSchool(@Valid @RequestBody SchoolRequest request) {
        try {
            SchoolResponse school = schoolService.createSchool(request);
            return ResponseEntity.ok(school);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getAllSchools() {
        try {
            List<SchoolResponse> schools = schoolService.getAllSchools();
            return ResponseEntity.ok(schools);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSchool(@PathVariable Long id) {
        try {
            SchoolResponse school = schoolService.getSchool(id);
            return ResponseEntity.ok(school);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchool(@PathVariable Long id) {
        try {
            schoolService.deleteSchool(id);
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
