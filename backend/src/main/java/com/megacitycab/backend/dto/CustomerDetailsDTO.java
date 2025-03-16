package com.megacitycab.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailsDTO {
    private String name;
    private String address;
    private String nic;
    private String userId;
    private String customerId;
}