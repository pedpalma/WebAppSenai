package com.example.imagemPecas.application.users;

import com.example.imagemPecas.application.jwt.JwtService;
import com.example.imagemPecas.domain.AccessToken;
import com.example.imagemPecas.domain.entity.User;
import com.example.imagemPecas.domain.exception.BusinessRuleException;
import com.example.imagemPecas.domain.exception.DuplicatedTupleException;
import com.example.imagemPecas.domain.service.UserService;
import com.example.imagemPecas.infra.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final int MIN_PASSWORD_LENGTH = 8; // RN02
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User save(User user) {
        validate(user);

        // RN01: não é permitido cadastrar dois usuários com o mesmo e-mail
        var possibleUser = getByEmail(user.getEmail());
        if (possibleUser != null) {
            throw new DuplicatedTupleException("User already exists!");
        }

        encodePassword(user);
        return userRepository.save(user);
    }

    @Override
    public AccessToken autheticate(String email, String password) {
        var user = getByEmail(email);
        if (user == null || password == null) {
            return null;
        }

        boolean matches = passwordEncoder.matches(password, user.getPassword());
        if (matches) {
            return jwtService.generateToken(user);
        }
        return null;
    }

    private void validate(User user) {
        if (!StringUtils.hasText(user.getName())) {
            throw new BusinessRuleException("Name is required!");
        }
        if (!StringUtils.hasText(user.getEmail()) || !EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new BusinessRuleException("Invalid e-mail!");
        }
        if (user.getPassword() == null || user.getPassword().length() < MIN_PASSWORD_LENGTH) {
            throw new BusinessRuleException("Password must have at least 8 characters!");
        }
        user.setName(user.getName().trim());
        user.setEmail(user.getEmail().trim().toLowerCase());
    }

    private void encodePassword(User user) {
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
    }
}
