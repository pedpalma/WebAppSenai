package com.example.imagemPecas.application.users;

import com.example.imagemPecas.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    // CSU01 - Cadastrar-se
    @PostMapping
    public ResponseEntity save(@RequestBody UserDTO dto) {
        var user = userMapper.mapToUser(dto);
        userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // CSU02 - Autenticar-se
    @PostMapping("/auth")
    public ResponseEntity autheticate(@RequestBody CredentialsDTO credentials) {
        var email = credentials.getEmail() == null ? null : credentials.getEmail().trim().toLowerCase();
        var token = userService.autheticate(email, credentials.getPassword());

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User or password are incorrect!"));
        }

        return ResponseEntity.ok(token);
    }
}
