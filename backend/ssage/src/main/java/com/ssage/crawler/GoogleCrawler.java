package com.ssage.crawler;

import com.ssage.dto.SearchResponse;
import io.github.bonigarcia.wdm.WebDriverManager;
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
            File tempImage = saveImageTemporarily(image);
            String searchUrl = uploadImageAndSearch(tempImage);

            if (searchUrl == null) {
                log.error("🔥 구글 이미지 검색 실패 (검색 URL이 null)");
                return results;
            }

            Document doc = Jsoup.connect(searchUrl)
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
                    .get();

            for (Element result : doc.select("div.tF2Cxc a")) {
                String productUrl = result.attr("href");
                log.info("✅ 찾은 상품 페이지 URL: {}", productUrl);

                String price = fetchPriceFromPage(productUrl);
                if (price != null) {
                    results.add(new SearchResponse("상품", price, productUrl));
                }
            }

            tempImage.delete();

        } catch (Exception e) {
            log.error("🔥 이미지 검색 중 오류 발생: " + e.getMessage(), e);  // ✅ 전체 예외 스택 출력
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
     * 🔹 Selenium을 이용해 구글 이미지 검색 수행 후 검색 결과 URL 반환 test
     */
    private String uploadImageAndSearch(File imageFile) {
        System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver");  // ✅ 올바른 경로 설정

        ChromeOptions options = new ChromeOptions();
        options.setBinary("/usr/bin/chromium");  // ✅ Chromium을 실행하도록 설정
        options.addArguments("--headless");
        options.addArguments("--no-sandbox");  // ✅ Chrome이 Docker에서 정상 실행되도록 설정
        options.addArguments("--disable-gpu");  // ✅ GPU 관련 오류 방지
        options.addArguments("--disable-dev-shm-usage");  // ✅ 메모리 부족 문제 방지
        options.addArguments("--disable-software-rasterizer");  // ✅ GPU 렌더링 비활성화 (DBus 문제 해결)
        options.addArguments("--disable-features=VizDisplayCompositor");  // ✅ VizDisplayCompositor 비활성화

        WebDriver driver = new ChromeDriver(options);

        try {
            log.info("✅ Selenium WebDriver 실행 시작...");
            driver = new ChromeDriver(options);
            log.info("✅ Selenium WebDriver 실행 성공!");

            driver.get(GOOGLE_IMAGE_SEARCH_URL);
            log.info("✅ 구글 이미지 검색 페이지 접근 완료");

            // "이미지로 검색" 버튼 찾기
            WebElement searchByImageButton = driver.findElement(By.cssSelector("div.qbtbha.qbtbtxt"));
            searchByImageButton.click();
            log.info("✅ 이미지 검색 버튼 클릭 완료");

            // 파일 업로드 버튼 찾기 & 이미지 업로드
            WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
            fileInput.sendKeys(imageFile.getAbsolutePath());
            log.info("✅ 이미지 업로드 완료: {}", imageFile.getAbsolutePath());

            // 업로드 후 결과 페이지 대기
            Thread.sleep(5000);
            log.info("✅ 검색 결과 페이지 로딩 완료");

            // 현재 페이지 URL 가져오기
            String searchResultUrl = driver.getCurrentUrl();
            log.info("✅ 구글 이미지 검색 결과 URL: {}", searchResultUrl);

            return searchResultUrl;

        } catch (Exception e) {
            log.error("🔥 Selenium 이미지 업로드 중 오류 발생: " + e.getMessage(), e);
            return null;
        } finally {
            if (driver != null) {
                driver.quit();
                log.info("✅ WebDriver 종료 완료");
            }
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
