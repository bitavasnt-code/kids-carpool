package com.kidscarpool.dto;

import com.kidscarpool.model.Message;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private Long sender_id;
    private Long receiver_id;
    private String content;
    private Boolean is_read;
    private LocalDateTime created_at;
    
    public static MessageResponse fromMessage(Message message) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setSender_id(message.getSenderId());
        response.setReceiver_id(message.getReceiverId());
        response.setContent(message.getContent());
        response.setIs_read(message.getIsRead());
        response.setCreated_at(message.getCreatedAt());
        return response;
    }
}
