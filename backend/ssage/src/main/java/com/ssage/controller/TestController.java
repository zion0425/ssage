package com.ssage.controller;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TestController {

    @GetMapping("/test")
    public String testEndpoint() {
        return "Test API is working!!!!!";
    }
}
