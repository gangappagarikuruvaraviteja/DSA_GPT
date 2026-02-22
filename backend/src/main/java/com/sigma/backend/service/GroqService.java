package com.sigma.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class GroqService {

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public String chat(String message) {

        try {
            // Build request as MAP (not raw string)
            Map<String, Object> bodyMap = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", new Object[]{
                            Map.of(
                                    "role", "user",
                                    "content", message
                            )
                    }
            );

            String json = mapper.writeValueAsString(bodyMap);

            RequestBody body = RequestBody.create(
                    json,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(URL)
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();

            String raw = response.body().string();

            if (!response.isSuccessful()) {
                return "Groq API error: HTTP " + response.code() + " | " + raw;
            }

            JsonNode root = mapper.readTree(raw);
            return root
                    .get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();

        } catch (IOException e) {
            return "Groq API exception: " + e.getMessage();
        }
    }
}
