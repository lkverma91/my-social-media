package com.mysocialmedia.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String bio;
    private List<String> followers;
    private List<String> following;
    private LocalDateTime createdAt;
}
