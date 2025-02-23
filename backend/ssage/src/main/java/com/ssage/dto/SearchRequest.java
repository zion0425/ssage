package com.ssage.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class SearchRequest {
    private MultipartFile image; // 이미지 파일
}
