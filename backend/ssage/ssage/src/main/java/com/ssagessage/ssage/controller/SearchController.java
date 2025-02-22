package com.ssage.controller;

import com.ssage.dto.SearchRequest;
import com.ssage.dto.SearchResponse;
import com.ssage.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @PostMapping
    public ResponseEntity<List<SearchResponse>> search(@RequestParam("image") MultipartFile image) {
        List<SearchResponse> results = searchService.searchByImage(image);
        return ResponseEntity.ok(results);
    }
}
