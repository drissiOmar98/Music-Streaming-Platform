package com.omar.event_participation_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableFeignClients
@EnableJpaAuditing(auditorAwareRef = "auditorAware")
public class EventParticipationServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventParticipationServiceApplication.class, args);
	}

}
