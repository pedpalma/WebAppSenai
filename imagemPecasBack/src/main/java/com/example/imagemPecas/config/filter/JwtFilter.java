package com.example.imagemPecas.config.filter;

import com.example.imagemPecas.application.jwt.InvalidTokenException;
import com.example.imagemPecas.application.jwt.JwtService;
import com.example.imagemPecas.domain.entity.User;
import com.example.imagemPecas.domain.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getToken(request);

        if (token != null) {
            try {
                String email = jwtService.getEmailFromToken(token);
                User user = userService.getByEmail(email);
                if (user != null) {
                    setUserAsAuthenticated(user);
                }
            } catch (InvalidTokenException e) {
                log.warn("Token inválido: {}", e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Invalid or expired token!\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private void setUserAsAuthenticated(User user) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();

        var authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private String getToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            String[] authHeaderParts = authHeader.split(" ");
            if (authHeaderParts.length == 2 && "Bearer".equalsIgnoreCase(authHeaderParts[0])) {
                return authHeaderParts[1];
            }
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // cadastro e autenticação de usuários não exigem token
        return request.getRequestURI().startsWith("/v1/users");
    }
}
