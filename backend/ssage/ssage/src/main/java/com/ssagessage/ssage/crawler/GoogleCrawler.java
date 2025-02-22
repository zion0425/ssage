package com.ssage.crawler;

import com.ssage.dto.SearchResponse;
import org.jsoup.Jsoup;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Component
public class GoogleCrawler {

    public List<SearchResponse> search(MultipartFile image) {
        List<SearchResponse> results = new ArrayList<>();

        // 예시 크롤링 로직
        // 실제로는 이미지 업로드 후 검색 요청을 보내야 함
        results.add(new SearchResponse("Google 상품1", "₩10,000", "http://example.com"));
        results.add(new SearchResponse("Google 상품2", "₩15,000", "http://example.com"));

        return results;
    }
}
