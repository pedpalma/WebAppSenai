package com.example.imagemPecas.application.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

/**
 * Fornece a chave usada para assinar os tokens JWT (HS256).
 * Se a propriedade jwt.secret (variável de ambiente JWT_SECRET) tiver pelo menos 32 caracteres,
 * ela é usada; caso contrário, uma chave aleatória é gerada a cada inicialização da API.
 */
@Component
public class SecretKeyGenerator {

    private final SecretKey key;

    public SecretKeyGenerator(@Value("${jwt.secret:}") String secret) {
        if (StringUtils.hasText(secret) && secret.getBytes(StandardCharsets.UTF_8).length >= 32) {
            this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        } else {
            this.key = Jwts.SIG.HS256.key().build();
        }
    }

    public SecretKey getKey() {
        return key;
    }
}
