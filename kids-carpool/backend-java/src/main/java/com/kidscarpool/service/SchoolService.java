package com.kidscarpool.service;

import com.kidscarpool.dto.SchoolRequest;
import com.kidscarpool.dto.SchoolResponse;
import com.kidscarpool.model.School;
import com.kidscarpool.repository.SchoolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchoolService {
    
    @Autowired
    private SchoolRepository schoolRepository;
    
    public SchoolResponse createSchool(SchoolRequest request) {
        School school = new School();
        school.setName(request.getName());
        school.setAddress(request.getAddress());
        school.setCity(request.getCity());
        school.setState(request.getState());
        school.setZipCode(request.getZip_code());
        school.setLatitude(request.getLatitude());
        school.setLongitude(request.getLongitude());
        school.setStartTime(request.getStart_time());
        school.setEndTime(request.getEnd_time());
        
        School savedSchool = schoolRepository.save(school);
        return SchoolResponse.fromSchool(savedSchool);
    }
    
    public List<SchoolResponse> getAllSchools() {
        return schoolRepository.findAll().stream()
                .map(SchoolResponse::fromSchool)
                .collect(Collectors.toList());
    }
    
    public SchoolResponse getSchool(Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        return SchoolResponse.fromSchool(school);
    }
    
    public void deleteSchool(Long id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("School not found"));
        schoolRepository.delete(school);
    }
}
