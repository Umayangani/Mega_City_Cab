package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.LoginDTO;
import com.megacitycab.backend.dto.LoginResponseDTO;
import com.megacitycab.backend.dto.RegistrationDTO;
import com.megacitycab.backend.model.Customer;
import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.CustomerRepository;
import com.megacitycab.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.megacitycab.backend.util.SimplePasswordEncoder;
import com.megacitycab.backend.util.SimpleJwtUtil;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SimpleJwtUtil jwtUtil;

    @Autowired
    public AuthService(UserRepository userRepository, CustomerRepository customerRepository, SimpleJwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public User registerCustomer(RegistrationDTO registrationDTO) {
        // Validate if username or email already exists
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Check if NIC already exists
        if (customerRepository.existsByNic(registrationDTO.getCustomerDetails().getNic())) {
            throw new RuntimeException("NIC already registered");
        }

        // Generate IDs
        String userId = generateUserId();
        String customerId = generateCustomerId();

        // Create and save User
        User user = new User();
        user.setId(userId);
        user.setUsername(registrationDTO.getUsername());
        user.setPassword(SimplePasswordEncoder.encode(registrationDTO.getPassword()));
        user.setEmail(registrationDTO.getEmail());
        user.setPhone(registrationDTO.getPhone());
        user.setRole(User.UserRole.CUSTOMER);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Create and save Customer
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setUserId(userId);
        customer.setName(registrationDTO.getCustomerDetails().getName());
        customer.setAddress(registrationDTO.getCustomerDetails().getAddress());
        customer.setNic(registrationDTO.getCustomerDetails().getNic());
        customer.setRegisteredDate(LocalDateTime.now());

        customerRepository.save(customer);

        return savedUser;
    }

    private String generateUserId() {
        // Generate a shorter ID that fits your varchar(10) field
        return "U" + String.format("%08d", new Random().nextInt(100000000));
    }

    private String generateCustomerId() {
        return "C" + String.format("%08d", new Random().nextInt(100000000));
    }

    public LoginResponseDTO login(LoginDTO loginDTO) {
        // Find user by username
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if user is active
        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Account is inactive");
        }

        // Verify password
        if (!SimplePasswordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());

        // Create response object
        LoginResponseDTO response = LoginResponseDTO.fromUser(user, token);

        // Add role-specific details
        switch (user.getRole()) {
            case CUSTOMER:
                customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
                    response.setName(customer.getName());
                    response.setUserId(customer.getId());
                });
                break;
            case DRIVER:
                // Add driver specific details if you have a driver repository
                // driverRepository.findByUserId(user.getId())...
                break;
            case ADMIN:
            case RECEPTIONIST:
                // Add admin/receptionist details if needed
                break;
        }

        return response;
    }
}