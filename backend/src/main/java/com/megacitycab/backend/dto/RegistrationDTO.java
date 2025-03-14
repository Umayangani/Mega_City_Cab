package com.megacitycab.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationDTO {
    private String username;
    private String password;
    private String email;
    private String phone;
    private String role;
    private CustomerDetailsDTO customerDetails;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CustomerDetailsDTO {
        private String name;
        private String address;
        private String nic;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public CustomerDetailsDTO getCustomerDetails() {
        return customerDetails;
    }

    public void setCustomerDetails(CustomerDetailsDTO customerDetails) {
        this.customerDetails = customerDetails;
    }
}