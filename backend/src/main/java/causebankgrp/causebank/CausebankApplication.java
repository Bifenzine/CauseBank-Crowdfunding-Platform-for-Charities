package causebankgrp.causebank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@OpenAPIDefinition
public class CausebankApplication {

	public static void main(String[] args) {
		SpringApplication.run(CausebankApplication.class, args);
	}

}
