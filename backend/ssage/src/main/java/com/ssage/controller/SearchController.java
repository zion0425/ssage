package com.ssage.controller;

import com.ssage.dto.SearchResponse;
import com.ssage.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    @PostMapping
    public ResponseEntity<List<SearchResponse>> searchByImage(@RequestParam("image") MultipartFile image) {
        if (image.isEmpty()) {
            return ResponseEntity.badRequest().body(List.of()); // 빈 JSON 배열 반환
        }

        log.info("이미지 검색 요청: {}", image.getOriginalFilename());

        List<SearchResponse> results = searchService.searchByImage(image);

        if (results.isEmpty()) {
            return ResponseEntity.ok(List.of()); // 204 No Content 대신 빈 리스트 반환
        }

        return ResponseEntity.ok(results);
    }

}
