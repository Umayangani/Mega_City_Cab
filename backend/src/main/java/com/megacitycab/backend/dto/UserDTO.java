package com.megacitycab.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;
    private String status;
    private CustomerDetailsDTO customerDetails;
    private DriverDetailsDTO driverDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverDetailsDTO {
        private String name;
        private String license;
        private String address;
        private String nic;
    }
}
