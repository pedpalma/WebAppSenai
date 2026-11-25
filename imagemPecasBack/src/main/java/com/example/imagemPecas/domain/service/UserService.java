package com.example.imagemPecas.domain.service;

import com.example.imagemPecas.domain.AccessToken;
import com.example.imagemPecas.domain.entity.User;

public interface UserService {
    User getByEmail(String email);

    User save(User user);

    AccessToken autheticate(String email, String password);
}
