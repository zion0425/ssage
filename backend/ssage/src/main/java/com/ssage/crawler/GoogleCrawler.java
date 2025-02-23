package com.ssage.crawler;

import com.ssage.dto.SearchResponse;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class GoogleCrawler {

    private static final String GOOGLE_IMAGE_SEARCH_URL = "https://www.google.com/searchbyimage?image_url=";

    public List<SearchResponse> search(MultipartFile image) {
        List<SearchResponse> results = new ArrayList<>();

        try {
            // 🔹 Step 1: 이미지 임시 저장
            File tempImage = saveImageTemporarily(image);

            // 🔹 Step 2: Google Image Search 요청 (임시 파일 사용)
            String imageUrl = "file://" + tempImage.getAbsolutePath();
            Document doc = Jsoup.connect(GOOGLE_IMAGE_SEARCH_URL + imageUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36")
                    .get();

            // 🔹 Step 3: 검색 결과 크롤링
            for (Element result : doc.select("div.tF2Cxc a")) {
                String productUrl = result.attr("href");
                log.info("찾은 상품 페이지 URL: " + productUrl);

                // 🔹 Step 4: 해당 페이지에서 가격 크롤링
                String price = fetchPriceFromPage(productUrl);
                if (price != null) {
                    results.add(new SearchResponse("상품", price, productUrl));
                }
            }

            // 🔹 Step 5: 사용한 이미지 삭제
            tempImage.delete();

        } catch (IOException e) {
            log.error("구글 크롤링 중 오류 발생", e);
        }

        return results;
    }

    /**
     * MultipartFile을 로컬 파일로 임시 저장하는 메서드
     */
    private File saveImageTemporarily(MultipartFile image) throws IOException {
        File tempFile = File.createTempFile("uploaded_", ".jpg");
        image.transferTo(tempFile);
        return tempFile;
    }

    /**
     * 상품 페이지에서 가격 정보를 가져오는 메서드
     */
    private String fetchPriceFromPage(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36")
                    .get();

            String[] priceSelectors = {
                    "span.price",
                    "div.price-box",
                    "span.a-price"
            };

            for (String selector : priceSelectors) {
                Element priceElement = doc.selectFirst(selector);
                if (priceElement != null) {
                    return priceElement.text();
                }
            }

        } catch (IOException e) {
            log.error("상품 페이지 크롤링 중 오류 발생: " + url, e);
        }

        return null;
    }
}
