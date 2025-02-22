package com.ssage.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SearchResponse {
    private String productName; // 상품명
    private String price;       // 가격
    private String link;        // 구매 링크
}
