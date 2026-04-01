package com.mysocialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostDTO {

    @NotBlank(message = "Content is required")
    private String content;
}
