package com.kidscarpool.service;

import com.kidscarpool.dto.ChildRequest;
import com.kidscarpool.dto.ChildResponse;
import com.kidscarpool.model.Child;
import com.kidscarpool.repository.ChildRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChildService {
    
    @Autowired
    private ChildRepository childRepository;
    
    public ChildResponse createChild(ChildRequest request, Long userId) {
        Child child = new Child();
        child.setName(request.getName());
        child.setAge(request.getAge());
        child.setGrade(request.getGrade());
        child.setSchoolId(request.getSchool_id());
        child.setUserId(userId);
        child.setEmergencyContactName(request.getEmergency_contact_name());
        child.setEmergencyContactPhone(request.getEmergency_contact_phone());
        child.setMedicalInfo(request.getMedical_info());
        child.setSpecialNeeds(request.getSpecial_needs());
        
        Child savedChild = childRepository.save(child);
        return ChildResponse.fromChild(savedChild);
    }
    
    public List<ChildResponse> getUserChildren(Long userId) {
        return childRepository.findByUserId(userId).stream()
                .map(ChildResponse::fromChild)
                .collect(Collectors.toList());
    }
    
    public ChildResponse getChild(Long id, Long userId) {
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        
        if (!child.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to child");
        }
        
        return ChildResponse.fromChild(child);
    }
    
    public void deleteChild(Long id, Long userId) {
        Child child = childRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Child not found"));
        
        if (!child.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to child");
        }
        
        childRepository.delete(child);
    }
}
