package com.ssage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@SpringBootApplication
@ComponentScan(basePackages = "com.ssage.controller")
public class SsageApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsageApplication.class, args);
    }

}
