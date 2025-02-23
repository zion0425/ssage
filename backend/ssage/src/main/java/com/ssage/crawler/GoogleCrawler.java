package com.ssage.crawler;

import com.ssage.dto.SearchResponse;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class GoogleCrawler {

    private static final String GOOGLE_IMAGE_SEARCH_URL = "https://www.google.com/imghp?sbi=1";

    public List<SearchResponse> search(MultipartFile image) {
        List<SearchResponse> results = new ArrayList<>();

        try {
            // 🔹 1. 이미지 임시 저장
            File tempImage = saveImageTemporarily(image);

            // 🔹 2. Selenium을 이용해 구글에 이미지 업로드 후 검색 URL 얻기
            String searchUrl = uploadImageAndSearch(tempImage);

            if (searchUrl == null) {
                log.error("구글 이미지 검색 실패");
                return results;
            }

            // 🔹 3. Jsoup을 이용해 검색 결과 페이지 크롤링
            Document doc = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .get();

            // 🔹 4. 검색 결과에서 상품 페이지 URL 추출
            for (Element result : doc.select("div.tF2Cxc a")) {
                String productUrl = result.attr("href");
                log.info("찾은 상품 페이지 URL: " + productUrl);

                // 🔹 5. 해당 페이지에서 가격 크롤링
                String price = fetchPriceFromPage(productUrl);
                if (price != null) {
                    results.add(new SearchResponse("상품", price, productUrl));
                }
            }

            // 🔹 6. 사용한 이미지 삭제
            tempImage.delete();

        } catch (IOException e) {
            log.error("구글 크롤링 중 오류 발생", e);
        }

        return results;
    }

    /**
     * 🔹 MultipartFile을 로컬 파일로 임시 저장하는 메서드
     */
    private File saveImageTemporarily(MultipartFile image) throws IOException {
        File tempFile = File.createTempFile("uploaded_", ".jpg");
        image.transferTo(tempFile);
        return tempFile;
    }

    /**
     * 🔹 Selenium을 이용해 구글 이미지 검색 수행 후 검색 결과 URL 반환
     */
    private String uploadImageAndSearch(File imageFile) {
        System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver");

        ChromeOptions options = new ChromeOptions();
        options.setBinary("/usr/bin/chromium-browser");  // ✅ Chromium 사용하도록 설정
        options.addArguments("--headless");  // ✅ GUI 없이 실행
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        WebDriver driver = new ChromeDriver(options);

        try {
            // 🔹 1. Google 이미지 검색 페이지 열기
            driver.get(GOOGLE_IMAGE_SEARCH_URL);

            // 🔹 2. "이미지로 검색" 버튼 클릭
            WebElement searchByImageButton = driver.findElement(By.cssSelector("div.qbtbha.qbtbtxt"));
            searchByImageButton.click();

            // 🔹 3. 파일 업로드 버튼 찾기 & 이미지 업로드
            WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
            fileInput.sendKeys(imageFile.getAbsolutePath());

            // 🔹 4. 업로드 후, 결과 페이지로 이동 (잠시 대기)
            Thread.sleep(5000);

            // 🔹 5. 현재 페이지 URL 가져오기
            String searchResultUrl = driver.getCurrentUrl();
            log.info("구글 이미지 검색 결과 URL: {}", searchResultUrl);

            return searchResultUrl;

        } catch (Exception e) {
            log.error("구글 이미지 업로드 중 오류 발생", e);
            return null;
        } finally {
            driver.quit();
        }
    }

    /**
     * 🔹 상품 페이지에서 가격 정보를 가져오는 메서드 (Jsoup 사용)
     */
    private String fetchPriceFromPage(String url) {
        try {
            Document doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .get();

            String[] priceSelectors = {
                    "span.price",
                    "div.price-box",
                    "span.a-price",
                    "meta[itemprop=price]",
                    "span[class*=price]"
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
