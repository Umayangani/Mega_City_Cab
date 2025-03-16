package com.megacitycab.backend.dto;

import com.megacitycab.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private String token;

    private String name;
    private String userId;

    public static LoginResponseDTO fromUser(User user, String token) {
        LoginResponseDTO response = new LoginResponseDTO();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().toString());
        response.setToken(token);
        return response;
    }
}