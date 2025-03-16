package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.LoginDTO;
import com.megacitycab.backend.dto.LoginResponseDTO;
import com.megacitycab.backend.dto.RegistrationDTO;
import com.megacitycab.backend.dto.UserDTO;
import com.megacitycab.backend.model.Customer;
import com.megacitycab.backend.model.Driver;
import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.CustomerRepository;
import com.megacitycab.backend.repository.DriverRepository;
import com.megacitycab.backend.repository.UserRepository;
import com.megacitycab.backend.util.SimpleJwtUtil;
import com.megacitycab.backend.util.SimplePasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final DriverRepository driverRepository;
    private final SimpleJwtUtil jwtUtil;

    @Autowired
    public AuthService(UserRepository userRepository, CustomerRepository customerRepository,
                       DriverRepository driverRepository, SimpleJwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.driverRepository = driverRepository;
        this.jwtUtil = jwtUtil;
    }

    // Other methods remain the same

    public LoginResponseDTO login(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (user.getStatus() != User.UserStatus.ACTIVE) {
            throw new RuntimeException("Account is inactive");
        }

        if (!SimplePasswordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().toString());
        LoginResponseDTO response = LoginResponseDTO.fromUser(user, token);

        switch (user.getRole()) {
            case CUSTOMER:
                customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
                    response.setName(customer.getName());
                    response.setUserId(customer.getId());
                });
                break;
            case DRIVER:
                // Change this line
                driverRepository.findByUserId(user.getId()).ifPresent(driver -> {
                    response.setName(driver.getName());
                    response.setUserId(driver.getId().toString());
                });
                break;
            case ADMIN:
            case RECEPTIONIST:
                // No specific details needed
                break;
        }

        return response;
    }

    @Transactional
    public User registerCustomer(RegistrationDTO registrationDTO) {
        // Validate input
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        String userId = generateUserId();
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

        // Create customer details if provided
        if (registrationDTO.getCustomerDetails() != null) {
            Customer customer = new Customer();
            customer.setUserId(userId);
            customer.setName(registrationDTO.getCustomerDetails().getName());
            customer.setAddress(registrationDTO.getCustomerDetails().getAddress());
            customer.setNic(registrationDTO.getCustomerDetails().getNic());
            customer.setRegisteredDate(LocalDateTime.now());
            customerRepository.save(customer);
        }

        return savedUser;
    }

    @Transactional
    public User registerAdmin(UserDTO userDTO) {
        // Validate input
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        String userId = generateUserId();
        User user = new User();
        user.setId(userId);
        user.setUsername(userDTO.getUsername());
        user.setPassword(SimplePasswordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setRole(User.UserRole.ADMIN);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    private String generateUserId() {
        return "U" + String.format("%08d", new Random().nextInt(100000000));
    }
}