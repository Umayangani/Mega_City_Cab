package com.megacitycab.backend.service;

import com.megacitycab.backend.dto.UserDTO;
import com.megacitycab.backend.model.Customer;
import com.megacitycab.backend.model.Driver;
import com.megacitycab.backend.model.User;
import com.megacitycab.backend.repository.CustomerRepository;
import com.megacitycab.backend.repository.DriverRepository;
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
    private final DriverRepository driverRepository;

    @Autowired
    public UserService(UserRepository userRepository, CustomerRepository customerRepository, DriverRepository driverRepository) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.driverRepository = driverRepository;
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
        if (userRepository.existsByUsername(userDTO.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        String userId = generateUserId();
        User user = new User();
        user.setId(userId);
        user.setUsername(userDTO.getUsername());
        user.setPassword(SimplePasswordEncoder.encode(userDTO.getPassword()));
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());

        try {
            user.setRole(User.UserRole.valueOf(userDTO.getRole().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified");
        }

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


        if (user.getRole() == User.UserRole.DRIVER && userDTO.getDriverDetails() != null) {

            if (userDTO.getDriverDetails().getLicense() != null &&
                    driverRepository.existsByLicenseNumber(userDTO.getDriverDetails().getLicense())) {
                throw new RuntimeException("Driver license number already exists");
            }

            Driver driver = new Driver();
            driver.setUserId(String.valueOf(userId));
            driver.setLicenseNumber(userDTO.getDriverDetails().getLicense());
            driver.setAddress(userDTO.getDriverDetails().getAddress());
            driver.setNic(userDTO.getDriverDetails().getNic());
            driver.setPhoneNumber(user.getPhone());
            driver.setRegisteredDate(LocalDateTime.now());
            driver.setFirstName(userDTO.getDriverDetails().getName().split(" ")[0]);
            driver.setLastName(userDTO.getDriverDetails().getName().split(" ")[1]);

            driverRepository.save(driver);
        }

        return savedUser;
    }

    @Transactional
    public User updateUser(String id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

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
        User updatedUser = userRepository.save(user);

        if (userDTO.getCustomerDetails() != null) {
            customerRepository.findByUserId(id).ifPresent(customer -> {
                if (userDTO.getCustomerDetails().getName() != null) {
                    customer.setName(userDTO.getCustomerDetails().getName());
                }
                if (userDTO.getCustomerDetails().getAddress() != null) {
                    customer.setAddress(userDTO.getCustomerDetails().getAddress());
                }
                if (userDTO.getCustomerDetails().getNic() != null) {
                    customer.setNic(userDTO.getCustomerDetails().getNic());
                }
                customerRepository.save(customer);
            });
        }


        if (userDTO.getDriverDetails() != null) {
            driverRepository.findByUserId(String.valueOf(Integer.parseInt(id))).ifPresent(driver -> {
                if (userDTO.getDriverDetails().getName() != null) {
                    driver.setName(userDTO.getDriverDetails().getName());
                }
                if (userDTO.getDriverDetails().getAddress() != null) {
                    driver.setAddress(userDTO.getDriverDetails().getAddress());
                }
                if (userDTO.getDriverDetails().getNic() != null) {
                    driver.setNic(userDTO.getDriverDetails().getNic());
                }
                if (userDTO.getDriverDetails().getLicense() != null &&
                        !userDTO.getDriverDetails().getLicense().equals(driver.getLicenseNumber())) {
                    if (driverRepository.existsByLicenseNumber(userDTO.getDriverDetails().getLicense())) {
                        throw new RuntimeException("Driver license number already exists");
                    }
                    driver.setLicenseNumber(userDTO.getDriverDetails().getLicense());
                }
                driverRepository.save(driver);
            });
        }

        return updatedUser;
    }

    @Transactional
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }


        customerRepository.findByUserId(id).ifPresent(customerRepository::delete);
        driverRepository.findByUserId(id).ifPresent(driverRepository::delete);

        userRepository.deleteById(id);
    }

    private String generateUserId() {
        return "U" + String.format("%08d", new Random().nextInt(100000000));
    }

    private String generateCustomerId() {
        return "C" + String.format("%08d", new Random().nextInt(100000000));
    }
}