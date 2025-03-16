package com.megacitycab.backend.dto;

import com.megacitycab.backend.model.Driver.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDTO {
    private Integer id;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String licenseNumber;
    private String licenseExpiry;
    private Double rating;
    private Integer totalRatings;
    private DriverStatus status;


    private String fullName;
}