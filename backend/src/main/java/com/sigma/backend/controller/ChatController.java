package com.sigma.backend.controller;

import com.sigma.backend.dto.ChatRequest;
import com.sigma.backend.dto.ChatResponse;
import com.sigma.backend.service.GroqService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    private final GroqService groqService;

    public ChatController(GroqService groqService) {
        this.groqService = groqService;
    }

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = groqService.chat(request.getMessage());
        return new ChatResponse(reply);
    }
}
