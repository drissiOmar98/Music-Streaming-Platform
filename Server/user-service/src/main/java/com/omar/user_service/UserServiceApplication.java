package com.omar.user_service;

import com.omar.user_service.entity.Authority;
import com.omar.user_service.repository.AuthorityRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class UserServiceApplication {

	@Autowired
	private AuthorityRepository authorityRepository;

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}


	@PostConstruct
	public void initializeRoles() {
		// Check if the "ROLE_USER" exists, if not, create it
		if (authorityRepository.findByName("ROLE_USER").isEmpty()) {
			authorityRepository.save(new Authority("ROLE_USER"));
		}
		// You can add more roles if needed
		if (authorityRepository.findByName("ROLE_ADMIN").isEmpty()) {
			authorityRepository.save(new Authority("ROLE_ADMIN"));
		}
		// Add more roles here if necessary
	}



}
