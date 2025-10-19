package com.kidscarpool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KidsCarpoolApplication {

    public static void main(String[] args) {
        SpringApplication.run(KidsCarpoolApplication.java, args);
        System.out.println("\n" +
                "╔══════════════════════════════════════════════════════════╗\n" +
                "║                                                          ║\n" +
                "║          🚗 Kids Carpool Backend (Java)                 ║\n" +
                "║                                                          ║\n" +
                "║          Server running on: http://localhost:8080       ║\n" +
                "║          API Docs: http://localhost:8080/swagger-ui     ║\n" +
                "║                                                          ║\n" +
                "╚══════════════════════════════════════════════════════════╝\n");
    }
}
