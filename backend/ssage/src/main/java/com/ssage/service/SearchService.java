package com.ssage.service;

import com.ssage.crawler.GoogleCrawler;
import com.ssage.dto.SearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final GoogleCrawler googleCrawler;

    public List<SearchResponse> searchByImage(MultipartFile image) {
        log.info("이미지 검색 서비스 실행");

        List<SearchResponse> results = googleCrawler.search(image);

        // 🔹 가격 기준으로 정렬 (₩10,000 같은 형식 정리 후 비교)
        return results.stream()
                .sorted((a, b) -> {
                    int priceA = parsePrice(a.getPrice());
                    int priceB = parsePrice(b.getPrice());
                    return Integer.compare(priceA, priceB);
                })
                .collect(Collectors.toList());
    }

    private int parsePrice(String price) {
        try {
            return Integer.parseInt(price.replaceAll("[^\\d]", ""));
        } catch (NumberFormatException e) {
            log.error("가격 변환 오류: {}", price, e);
            return Integer.MAX_VALUE;  // 가격이 없거나 이상하면 가장 높은 가격으로 설정
        }
    }
}
