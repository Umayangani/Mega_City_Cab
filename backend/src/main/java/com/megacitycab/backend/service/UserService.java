package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.UserDTO;
import com.megacitycab.backend.model.Customer;
import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.CustomerRepository;
import com.megacitycab.backend.repository.UserRepository;
import com.megacitycab.backend.util.SimplePasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    @Autowired
    public UserService(UserRepository userRepository, CustomerRepository customerRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    @Transactional
    public User createUser(UserDTO userDTO) {
        // Validate if username or email already exists
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Generate user ID
        String userId = generateUserId();

        // Create user entity
        User user = new User();
        user.setId(userId);
        user.setUsername(userDTO.getUsername());
        user.setPassword(SimplePasswordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());

        // Set role
        try {
            user.setRole(User.UserRole.valueOf(userDTO.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified");
        }

        // Set status if provided, otherwise default to ACTIVE
        if (userDTO.getStatus() != null && !userDTO.getStatus().isEmpty()) {
            try {
                user.setStatus(User.UserStatus.valueOf(userDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status specified");
            }
        } else {
            user.setStatus(User.UserStatus.ACTIVE);
        }

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // If the role is CUSTOMER, also create a Customer record
        if (user.getRole() == User.UserRole.CUSTOMER && userDTO.getCustomerDetails() != null) {
            Customer customer = new Customer();
            customer.setId(generateCustomerId());
            customer.setUserId(userId);
            customer.setName(userDTO.getCustomerDetails().getName());
            customer.setAddress(userDTO.getCustomerDetails().getAddress());
            customer.setNic(userDTO.getCustomerDetails().getNic());
            customer.setRegisteredDate(LocalDateTime.now());

            customerRepository.save(customer);
        }

        // TODO: Handle DRIVER role similarly if needed

        return savedUser;
    }

    @Transactional
    public User updateUser(String id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields
        if (userDTO.getUsername() != null && !userDTO.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user.setUsername(userDTO.getUsername());
        }

        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(userDTO.getEmail());
        }

        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(SimplePasswordEncoder.encode(userDTO.getPassword()));
        }

        if (userDTO.getPhone() != null) {
            user.setPhone(userDTO.getPhone());
        }

        if (userDTO.getRole() != null) {
            try {
                user.setRole(User.UserRole.valueOf(userDTO.getRole().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role specified");
            }
        }

        if (userDTO.getStatus() != null) {
            try {
                user.setStatus(User.UserStatus.valueOf(userDTO.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status specified");
            }
        }

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private String generateUserId() {
        return "U" + String.format("%08d", new Random().nextInt(100000000));
    }

    private String generateCustomerId() {
        return "C" + String.format("%08d", new Random().nextInt(100000000));
    }
}