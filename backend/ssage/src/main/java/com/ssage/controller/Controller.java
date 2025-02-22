package com.ssage.controller;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class Controller {

    @GetMapping("/test")
    public String testEndpoint() {
        return "Test API is working!!";
    }
}
