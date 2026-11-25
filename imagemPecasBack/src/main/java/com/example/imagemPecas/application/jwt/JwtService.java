package com.example.imagemPecas.application.jwt;

import com.example.imagemPecas.domain.AccessToken;
import com.example.imagemPecas.domain.entity.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {

    // RN06 / RNF03: o token expira 60 minutos após ser emitido
    private static final long EXPIRATION_MINUTES = 60;

    private final SecretKeyGenerator keyGenerator;

    public AccessToken generateToken(User user) {
        var key = keyGenerator.getKey();
        var expirationDate = generateExpirationDate();
        var claims = generateTokenClaims(user);

        String token = Jwts.builder()
                .signWith(key)
                .subject(user.getEmail())
                .issuedAt(new Date())
                .expiration(expirationDate)
                .claims(claims)
                .compact();

        return new AccessToken(token);
    }

    public String getEmailFromToken(String tokenJwt) {
        try {
            var jwtParser = Jwts.parser()
                    .verifyWith(keyGenerator.getKey())
                    .build();

            return jwtParser.parseSignedClaims(tokenJwt)
                    .getPayload()
                    .getSubject();
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidTokenException(e.getMessage());
        }
    }

    private Date generateExpirationDate() {
        return Date.from(Instant.now().plus(EXPIRATION_MINUTES, ChronoUnit.MINUTES));
    }

    private Map<String, Object> generateTokenClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        return claims;
    }
}
