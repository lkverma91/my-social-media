package com.mysocialmedia.controller;

import com.mysocialmedia.dto.CommentDTO;
import com.mysocialmedia.model.Comment;
import com.mysocialmedia.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/api/posts/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getPostComments(postId));
    }

    @PostMapping("/api/posts/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable String postId,
                                               @Valid @RequestBody CommentDTO dto,
                                               Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(commentService.addComment(postId, dto.getContent(), userId));
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        commentService.deleteComment(id, userId);
        return ResponseEntity.ok().build();
    }
}
