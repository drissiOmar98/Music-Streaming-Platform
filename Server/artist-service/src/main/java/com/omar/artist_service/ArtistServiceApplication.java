package com.omar.artist_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class ArtistServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtistServiceApplication.class, args);
	}

}
