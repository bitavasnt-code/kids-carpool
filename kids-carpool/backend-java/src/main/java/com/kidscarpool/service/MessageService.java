package com.kidscarpool.service;

import com.kidscarpool.dto.MessageRequest;
import com.kidscarpool.dto.MessageResponse;
import com.kidscarpool.model.Message;
import com.kidscarpool.repository.MessageRepository;
import com.kidscarpool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public MessageResponse sendMessage(MessageRequest request, Long senderId) {
        // Verify receiver exists
        userRepository.findById(request.getReceiver_id())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(request.getReceiver_id());
        message.setContent(request.getContent());
        message.setIsRead(false);
        
        Message savedMessage = messageRepository.save(message);
        return MessageResponse.fromMessage(savedMessage);
    }
    
    public List<MessageResponse> getUserMessages(Long userId) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId).stream()
                .map(MessageResponse::fromMessage)
                .collect(Collectors.toList());
    }
    
    public MessageResponse markMessageRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getReceiverId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to message");
        }
        
        message.setIsRead(true);
        Message updatedMessage = messageRepository.save(message);
        return MessageResponse.fromMessage(updatedMessage);
    }
}
