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

    // Additional fields based on role
    private String name; // For all roles
    private String userId; // Reference to the user ID

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