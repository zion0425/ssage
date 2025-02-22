package com.ssage.service;

import com.ssage.crawler.BaiduCrawler;
import com.ssage.crawler.GoogleCrawler;
import com.ssage.crawler.NaverCrawler;
import com.ssage.dto.SearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final GoogleCrawler googleCrawler;
    private final NaverCrawler naverCrawler;
    private final BaiduCrawler baiduCrawler;

    public List<SearchResponse> searchByImage(MultipartFile image) {
        List<SearchResponse> results = new ArrayList<>();

        results.addAll(googleCrawler.search(image));
        results.addAll(naverCrawler.search(image));
        results.addAll(baiduCrawler.search(image));

        // 가격 기준으로 정렬 (예: "₩10,000" 같은 문자열을 숫자로 변환 후 정렬)
        results.sort((a, b) -> {
            int priceA = Integer.parseInt(a.getPrice().replaceAll("[^\\d]", ""));
            int priceB = Integer.parseInt(b.getPrice().replaceAll("[^\\d]", ""));
            return Integer.compare(priceA, priceB);
        });

        return results;
    }
}
