package com.kidscarpool.dto;

import com.kidscarpool.model.School;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SchoolResponse {
    private Long id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String zip_code;
    private Double latitude;
    private Double longitude;
    private String start_time;
    private String end_time;
    private LocalDateTime created_at;
    
    public static SchoolResponse fromSchool(School school) {
        SchoolResponse response = new SchoolResponse();
        response.setId(school.getId());
        response.setName(school.getName());
        response.setAddress(school.getAddress());
        response.setCity(school.getCity());
        response.setState(school.getState());
        response.setZip_code(school.getZipCode());
        response.setLatitude(school.getLatitude());
        response.setLongitude(school.getLongitude());
        response.setStart_time(school.getStartTime());
        response.setEnd_time(school.getEndTime());
        response.setCreated_at(school.getCreatedAt());
        return response;
    }
}
