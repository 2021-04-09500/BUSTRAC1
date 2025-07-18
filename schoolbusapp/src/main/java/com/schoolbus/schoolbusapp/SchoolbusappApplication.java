package com.schoolbus.schoolbusapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SchoolbusappApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolbusappApplication.class, args);
	}

}
