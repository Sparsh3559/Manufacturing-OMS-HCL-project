package com.oms.backend.dto.response;

import com.oms.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private User.Role role;
}