package com.mysocialmedia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentDTO {

    @NotBlank(message = "Content is required")
    private String content;
}
