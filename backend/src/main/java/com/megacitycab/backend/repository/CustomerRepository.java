package com.megacitycab.backend.repository;

import com.megacitycab.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    boolean existsByNic(String nic);
    Optional<Customer> findByUserId(String userId);
}