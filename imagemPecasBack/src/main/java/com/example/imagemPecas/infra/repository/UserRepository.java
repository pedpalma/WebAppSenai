package com.example.imagemPecas.infra.repository;

import com.example.imagemPecas.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    User findByEmail(String email);
}
