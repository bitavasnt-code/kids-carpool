package com.kidscarpool.security;

import com.kidscarpool.model.User;
import com.kidscarpool.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    
    @Autowired
    private UserRepository userRepository;
    
    public Long getUserIdFromAuthentication(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found in database"));
        return user.getId();
    }
}
