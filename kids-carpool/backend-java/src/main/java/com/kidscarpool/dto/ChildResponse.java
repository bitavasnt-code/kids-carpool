package com.kidscarpool.dto;

import com.kidscarpool.model.Child;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChildResponse {
    private Long id;
    private String name;
    private Integer age;
    private String grade;
    private Long school_id;
    private Long user_id;
    private String emergency_contact_name;
    private String emergency_contact_phone;
    private String medical_info;
    private String special_needs;
    private LocalDateTime created_at;
    
    public static ChildResponse fromChild(Child child) {
        ChildResponse response = new ChildResponse();
        response.setId(child.getId());
        response.setName(child.getName());
        response.setAge(child.getAge());
        response.setGrade(child.getGrade());
        response.setSchool_id(child.getSchoolId());
        response.setUser_id(child.getUserId());
        response.setEmergency_contact_name(child.getEmergencyContactName());
        response.setEmergency_contact_phone(child.getEmergencyContactPhone());
        response.setMedical_info(child.getMedicalInfo());
        response.setSpecial_needs(child.getSpecialNeeds());
        response.setCreated_at(child.getCreatedAt());
        return response;
    }
}
