package com.omar.user_service.repository;


import com.omar.user_service.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorityRepository extends JpaRepository<Authority,String> {
    Optional<Authority> findByName(String name);

}
