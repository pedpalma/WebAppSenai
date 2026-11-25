package com.example.imagemPecas.application.users;

import com.example.imagemPecas.domain.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public User mapToUser(UserDTO dto) {
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .build();
    }
}
