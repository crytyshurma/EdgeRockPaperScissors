package com.example.edgeai.service;
import org.springframework.core.io.ByteArrayResource;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.Map;

@Service
public class PythonService {

    public Map<String, Object> getPrediction(MultipartFile image, String mode) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://127.0.0.1:5000/predict";  // Flask URL

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename();
                }
            });

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            return response.getBody();

        } catch (Exception e) {
            return Map.of("error", e.getMessage());
        }
    }
}

