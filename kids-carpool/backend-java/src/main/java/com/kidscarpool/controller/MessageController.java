package com.kidscarpool.controller;

import com.kidscarpool.dto.MessageRequest;
import com.kidscarpool.dto.MessageResponse;
import com.kidscarpool.security.AuthUtil;
import com.kidscarpool.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private AuthUtil authUtil;
    
    @PostMapping
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            MessageResponse message = messageService.sendMessage(request, userId);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<?> getUserMessages() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            List<MessageResponse> messages = messageService.getUserMessages(userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markMessageRead(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = authUtil.getUserIdFromAuthentication(authentication);
            MessageResponse message = messageService.markMessageRead(id, userId);
            return ResponseEntity.ok(message);
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
